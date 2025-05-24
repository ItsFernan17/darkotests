import dlib
import cv2
import numpy as np
import os

# Inicialización
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MODELOS_DIR = os.path.join(BASE_DIR, "..", "..", "models")
predictor_path = os.path.join(MODELOS_DIR, "shape_predictor_68_face_landmarks.dat")
face_model_path = os.path.join(MODELOS_DIR, "dlib_face_recognition_resnet_model_v1.dat")

if not os.path.exists(predictor_path):
    raise FileNotFoundError(f"No se encontró el predictor en: {predictor_path}")
if not os.path.exists(face_model_path):
    raise FileNotFoundError(f"No se encontró el modelo de reconocimiento en: {face_model_path}")

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)
facerec = dlib.face_recognition_model_v1(face_model_path)

# 📏 Umbral más estricto
UMBRAL = 0.55

def es_borrosa(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    print(f"[BORROSIDAD] Varianza de Laplaciano: {lap_var:.2f}")
    return lap_var < 50

def obtener_descriptor(img_path):
    if not os.path.exists(img_path):
        return None
    img = cv2.imread(img_path)
    if img is None:
        return None
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    if len(faces) == 0:
        print(f"[DESCRIPTOR] ❌ No se detectó rostro en {img_path}")
        return None
    shape = predictor(gray, faces[0])
    return np.array(facerec.compute_face_descriptor(img, shape))

def verificar_imagen(ruta_img: str, carpeta_usuario: str):
    print(f"\n📥 Verificando identidad para imagen: {ruta_img}")
    print(f"📂 Fotos base: {carpeta_usuario}")

    registro = {}
    for tipo in ["frente", "perfil_izquierdo", "perfil_derecho"]:
        ruta_base = os.path.join(carpeta_usuario, f"{tipo}.jpg")
        descriptor = obtener_descriptor(ruta_base)
        if descriptor is not None:
            registro[tipo] = descriptor
        else:
            print(f"[BASE] ⚠️ No se pudo obtener descriptor para {tipo}")

    if not registro:
        return {"valido": False, "mensaje": "⚠️ No hay fotos base válidas para este usuario."}

    if not os.path.exists(ruta_img):
        return {"valido": False, "mensaje": "❌ No se encontró la imagen a verificar."}

    img = cv2.imread(ruta_img)
    if img is None:
        return {"valido": False, "mensaje": "❌ Error al leer la imagen a verificar."}

    borrosa = es_borrosa(img)
    print(f"[INFO] Imagen borrosa: {'Sí' if borrosa else 'No'}")

    if borrosa:
        return {
            "valido": False,
            "mensaje": "❌ La imagen está borrosa. Por favor acércate o mejora la iluminación.",
            "motivo": "borrosidad",
            "borrosa": True
        }

    print(f"[INFO] Umbral aplicado: {UMBRAL}")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    if len(faces) == 0:
        return {"valido": False, "mensaje": "❌ No se detectó rostro en la imagen."}

    shape = predictor(gray, faces[0])
    descriptor = np.array(facerec.compute_face_descriptor(img, shape))

    distancias = {}
    verificaciones = {}
    for tipo, emb in registro.items():
        distancia = np.linalg.norm(descriptor - emb)
        distancias[tipo] = float(round(distancia, 4))
        similitud = (1 - min(distancia, 1.0)) * 100
        verificado = distancia < UMBRAL
        verificaciones[tipo] = bool(verificado)
        print(f"[DISTANCIA] {tipo}: {distancia:.4f} → {'✅' if verificado else '❌'} (similitud ≈ {similitud:.2f}%)")

    cantidad_aciertos = sum(verificaciones.values())
    distancia_min = min(distancias.values())

    # ✅ Verificación por mayoría + validación fuerte por distancia mínima
    es_valido = cantidad_aciertos >= 2 and distancia_min < 0.6

    print(f"[RESULTADO FINAL] {'✅ Verificado' if es_valido else '❌ No verificado'}\n")

    return {
        "valido": bool(es_valido),
        "mensaje": "✅ Usuario verificado por mayoría." if es_valido else "❌ Usuario desconocido.",
        "borrosa": bool(borrosa),
        "umbral_usado": float(UMBRAL),
        "distancias": distancias,
        "distancia_min": float(round(distancia_min, 4)),
        "verificaciones": [
            {"tipo": k, "verificado": bool(v)} for k, v in verificaciones.items()
        ]
    }
