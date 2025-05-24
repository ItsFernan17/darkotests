# DarkoTests

## 🧠 Descripción

**DarkoTests** es una plataforma completa para la **gestión de exámenes, asignaciones y validación de identidad** en línea mediante inteligencia artificial. Incluye:

- **Backend:** NestJS  
- **Frontend:** Astro + React  
- **Módulo IA:** Verificación facial con **Dlib** para garantizar que el evaluado sea la persona correcta  
- **Captura automatizada de fotos** desde distintos ángulos (frente, perfil izquierdo y derecho)  
- **Generación automática de constancias en PDF**

---

## 🚀 Características

- Sistema de autenticación y roles
- Gestión de exámenes y asignaciones
- Validación facial continua durante exámenes
- Captura inteligente de imágenes usando IA
- Verificación biométrica con Dlib
- Exportación de resultados en PDF
- UI moderna con React Data Table y Bootstrap

---

## ⚙️ Requisitos previos

Asegúrate de tener instalado:

- **Node.js** v14 o superior  
- **npm** v6 o superior  
- **Python** 3.9 o superior (solo para el módulo IA)

---

## 💻 Instalación del sistema

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/darkotests.git
   cd darkotests
   ```
   
2. Instala las dependencias del frontend y backend:

   ```bash
   cd frontend
   npm install

   cd ../backend
   npm install
   ```

   > 💡 Alternativamente, puedes instalar **todas las dependencias desde la carpeta raíz** si tienes configurado un `package.json` con `workspaces` o usando un manejador de monorepos:

   ```bash
   npm install
   ```

---

## 🧠 Instalación del módulo IA (Verificación Facial)

Para que la verificación facial funcione correctamente:

### 📁 Carpeta `lib`

En `ml-api/app/lib/` se incluye una versión local de la librería **Dlib** para Python.

Instala Dlib desde esta ruta con el siguiente comando:

```bash
pip install C:\Users\ejemplo\Documentos\darkotests\ml-api\app\lib
```

> ⚠️ Reemplaza la ruta anterior con la tuya correspondiente en tu equipo.

---

### 📁 Carpeta `models`

Dentro de la carpeta `ml-api/models/`, debes colocar **manualmente** los siguientes archivos:

| Modelo | Descripción | Enlace de descarga |
|--------|-------------|--------------------|
| `dlib_face_recognition_resnet_model_v1.dat` | Modelo ResNet para embeddings faciales | [Descargar](https://www.dropbox.com/scl/fi/si0x2m3eaw1xd0sfmv0un/dlib_face_recognition_resnet_model_v1.dat?rlkey=fam4v1p74brle53jm11tl9e8y&st=zuek2r7l&dl=0) |
| `shape_predictor_68_face_landmarks.dat` | Modelo de 68 puntos de referencia facial | [Descargar](https://www.dropbox.com/scl/fi/ir6lx8hw0ihiydtk1ia0a/shape_predictor_68_face_landmarks.dat?rlkey=zky7a334wrzup20hivvz6dh4d&st=oicp35th&dl=0) |

> 🔒 Estos archivos son pesados y no se encuentran en el repositorio por defecto.

---

## 🧪 Verificación facial integrada

El sistema incorpora verificación facial en tiempo real mediante cámara web:

- Captura tres fotos desde distintos ángulos.
- Compara la imagen en vivo contra fotos base con Dlib.
- Anula automáticamente el examen tras múltiples fallos.

---

## 📄 Licencia

Este proyecto es de uso institucional. Derechos reservados © 2025.
