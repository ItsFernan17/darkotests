import cv2
import dlib
import numpy as np
import os

# Ruta absoluta al modelo de landmarks
predictor_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "models", "shape_predictor_68_face_landmarks.dat")
)

# Inicializa dlib
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

# Detección de borrosidad
def imagen_borrosa(img):
    lap_var = cv2.Laplacian(img, cv2.CV_64F).var()
    print(f"🔍 Varianza de Laplaciano: {lap_var:.2f}")
    return lap_var < 15

# Preprocesamiento
def preprocesar_imagen(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(gray)

# 🧠 Evalúa si el ojo está visible por apertura vertical
def ojo_visible(coords, indices):
    p_sup = coords[indices[1]]  # párpado superior
    p_inf = coords[indices[5]]  # párpado inferior
    apertura = np.linalg.norm(p_sup - p_inf)
    return apertura > 2  # umbral ajustable

# ✅ Validación completa de orientación
def validar_orientacion(ruta_img: str, tipo: str):
    try:
        img = cv2.imread(ruta_img)
        if img is None:
            return {"valido": False, "mensaje": "No se pudo leer la imagen", "tipo_detectado": None}

        if imagen_borrosa(img):
            return {"valido": False, "mensaje": "La imagen está borrosa", "tipo_detectado": None}

        gray = preprocesar_imagen(img)
        faces = detector(gray)

        if len(faces) == 0:
            return {"valido": False, "mensaje": "No se detectó rostro", "tipo_detectado": None}

        face = faces[0]
        shape = predictor(gray, face)
        coords = np.array([[p.x, p.y] for p in shape.parts()])

        # Landmarks clave
        ojo_izq = coords[36]
        ojo_der = coords[45]
        nariz = coords[30]
        centro_ojos_x = (ojo_izq[0] + ojo_der[0]) / 2
        desplazamiento = nariz[0] - centro_ojos_x
        distancia_ojos = np.linalg.norm(ojo_der - ojo_izq)
        desplazamiento_relativo = desplazamiento / distancia_ojos

        # Visibilidad de ojos
        def ojo_visible(indices):
            p_sup = coords[indices[1]]
            p_inf = coords[indices[5]]
            apertura = np.linalg.norm(p_sup - p_inf)
            return apertura > 2

        ojo_izq_visible = ojo_visible(list(range(36, 42)))
        ojo_der_visible = ojo_visible(list(range(42, 48)))
        ambos_ojos_visibles = bool(ojo_izq_visible and ojo_der_visible)

        print(f"📐 Desplazamiento nariz/ojos: {desplazamiento_relativo:.2f} | Ojos visibles: {ambos_ojos_visibles}")

        # Clasificación geométrica
        if abs(desplazamiento_relativo) < 0.08:
            detectado = "frente"
        elif desplazamiento_relativo > 0.30:
            detectado = "perfil_derecho"
        elif desplazamiento_relativo < -0.40:
            detectado = "perfil_izquierdo"
        else:
            detectado = "indefinido"

        # Rechaza si es "frente" pero no se ven bien los ojos
        if detectado == "frente" and not ambos_ojos_visibles:
            return {
                "valido": False,
                "mensaje": "Ambos ojos deben ser claramente visibles en la foto frontal.",
                "tipo_detectado": detectado,
                "ojos_visibles": False,
                "desplazamiento_relativo": round(desplazamiento_relativo, 2)
            }

        # Validación general
        valido = bool(detectado == tipo)

        return {
            "valido": valido,
            "mensaje": "Orientación válida." if valido else f"No coincide con la orientación esperada ({tipo}).",
            "tipo_detectado": detectado,
            "ojos_visibles": ambos_ojos_visibles,
            "desplazamiento_relativo": round(desplazamiento_relativo, 2)
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"valido": False, "mensaje": "Error procesando imagen", "tipo_detectado": None}