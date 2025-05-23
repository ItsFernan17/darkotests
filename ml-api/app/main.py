from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.status import HTTP_400_BAD_REQUEST
import uuid
import os

from app.utils.angulos import validar_orientacion
from app.utils.reconocimiento import verificar_imagen

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringe a tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FOTOS_BASE_DIR = os.path.abspath(os.path.join(BASE_DIR, "fotos"))  # dentro de ml-api/fotos
os.makedirs(FOTOS_BASE_DIR, exist_ok=True)

# ✅ Guarda una foto del evaluado
@app.post("/guardar-foto-evaluado/")
async def guardar_foto_evaluado(
    file: UploadFile = File(...),
    dpi: str = Form(...),
    tipo: str = Form(...)
):
    tipos_validos = ["frente", "perfil_izquierdo", "perfil_derecho"]
    if tipo not in tipos_validos:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Tipo no válido. Usa uno de: {tipos_validos}"
        )

    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png"]:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="Solo se permiten imágenes JPG o PNG."
        )

    carpeta_dpi = os.path.join(FOTOS_BASE_DIR, dpi)
    os.makedirs(carpeta_dpi, exist_ok=True)

    ruta_destino = os.path.join(carpeta_dpi, f"{tipo}.jpg")
    with open(ruta_destino, "wb") as f:
        f.write(await file.read())

    return {
        "mensaje": "✅ Foto guardada exitosamente",
        "ruta": f"/{ruta_destino.replace(os.sep, '/')}"
    }

# ✅ Valida orientación y guarda la imagen
@app.post("/validar-orientacion/")
async def validar_orientacion_guardando(
    file: UploadFile = File(...),
    tipo: str = Form(...),
    dpi: str = Form(...)
):
    tipos_validos = ["frente", "perfil_izquierdo", "perfil_derecho"]
    if tipo not in tipos_validos:
        raise HTTPException(status_code=400, detail=f"Tipo no válido. Usa uno de: {tipos_validos}")

    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png"]:
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes JPG o PNG.")

    carpeta_dpi = os.path.join(FOTOS_BASE_DIR, dpi)
    os.makedirs(carpeta_dpi, exist_ok=True)
    ruta_imagen = os.path.join(carpeta_dpi, f"{tipo}.jpg")

    with open(ruta_imagen, "wb") as f:
        f.write(await file.read())

    try:
        resultado = validar_orientacion(ruta_imagen, tipo)
        return JSONResponse(content={
            "ruta_guardada": f"/{ruta_imagen.replace(os.sep, '/')}",
            **resultado
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Verificación facial contra fotos guardadas
@app.post("/verificar-identidad/")
async def verificar_identidad(
    file: UploadFile = File(...),
    dpi: str = Form(...)
):
    carpeta_dpi = os.path.join(FOTOS_BASE_DIR, dpi)

    if not os.path.exists(carpeta_dpi):
        raise HTTPException(status_code=404, detail="Fotos base no encontradas para este usuario.")

    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png"]:
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes JPG o PNG.")

    filename = f"{uuid.uuid4()}.{ext}"
    ruta_temp = os.path.join("temp_uploads", filename)
    os.makedirs("temp_uploads", exist_ok=True)

    with open(ruta_temp, "wb") as f:
        f.write(await file.read())

    try:
        resultado = verificar_imagen(ruta_temp, carpeta_dpi)  # <- ✅ PASA carpeta_dpi
        return JSONResponse(content=resultado)
    finally:
        try:
            os.remove(ruta_temp)
        except Exception:
            pass


# 🗑️ Elimina las fotos cuando el usuario cierra sesión
@app.delete("/eliminar-fotos-evaluado/{dpi}")
async def eliminar_fotos_evaluado(dpi: str = Path(..., description="DPI del usuario")):
    carpeta_dpi = os.path.join(FOTOS_BASE_DIR, dpi)

    if not os.path.exists(carpeta_dpi):
        return {"mensaje": "⚠️ Carpeta no existe. Nada que eliminar."}

    try:
        for archivo in os.listdir(carpeta_dpi):
            os.remove(os.path.join(carpeta_dpi, archivo))
        os.rmdir(carpeta_dpi)
        return {"mensaje": f"🗑️ Fotos del usuario {dpi} eliminadas correctamente."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar carpeta: {str(e)}")
