import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { toast } from "react-toastify";
import { backendHost } from "../../utils/apiHost"; 
import { iaApiHost } from "../../utils/apiHost";

export default function CapturaFotos() {
  const videoRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const [fotosCapturadas, setFotosCapturadas] = useState([]);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [estadoAngulo, setEstadoAngulo] = useState(
    "Iniciando cámara. Por favor colócate frente al dispositivo y espera unos segundos."
  );
  const [esperandoCaptura, setEsperandoCaptura] = useState(false);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);

  const tipos = ["frente", "perfil_derecho", "perfil_izquierdo"];

  useLayoutEffect(() => {
    if (!camaraActiva) iniciarCamara();
  }, []);

  const iniciarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setCamaraActiva(true);
            setEstadoAngulo(
              "Cámara activada. Por favor mantén tu rostro centrado."
            );
          });
        };
      }
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      toast.error("No se pudo acceder a la cámara. Verifica permisos.");
      setCamaraActiva(false);
    }
  };

  useEffect(() => {
    let intervalo;

    if (camaraActiva && fotosCapturadas.length < 3) {
      intervalo = setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.videoWidth === 0) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        const tipoActual = tipos[fotosCapturadas.length];
        canvas.toBlob(async (blob) => {
          const esValido = await verificarOrientacion(blob, tipoActual);
          if (esValido && !esperandoCaptura && !temporizadorActivo) {
            setTemporizadorActivo(true);
            setEstadoAngulo(
              "Posición detectada correctamente. Preparando captura..."
            );

            setTimeout(() => {
              new Audio("/sonido-captura.mp3").play();
              const url = URL.createObjectURL(blob);

              setFotosCapturadas((prev) => {
                const nuevas = [...prev, { tipo: tipoActual, file: blob, url }];
                setEsperandoCaptura(false);
                setTemporizadorActivo(false);

                if (nuevas.length === 1) {
                  setEstadoAngulo(
                    "Muy bien. Ahora gira tu rostro ligeramente hacia la izquierda hasta que tu perfil izquierdo sea visible."
                  );
                } else if (nuevas.length === 2) {
                  setEstadoAngulo(
                    "Excelente. Ahora gira tu rostro hacia la derecha para registrar tu perfil derecho."
                  );
                } else {
                  setEstadoAngulo(
                    "Todas las capturas se han realizado exitosamente."
                  );
                  const tracks = videoRef.current?.srcObject?.getTracks();
                  tracks?.forEach((track) => track.stop());
                  videoRef.current.srcObject = null;
                  setCamaraActiva(false);
                }

                return nuevas;
              });
            }, 3000);
          }
        }, "image/jpeg");
      }, 1500);
    }

    return () => clearInterval(intervalo);
  }, [camaraActiva, fotosCapturadas, esperandoCaptura, temporizadorActivo]);

  const verificarOrientacion = async (blob, tipo) => {
    const formData = new FormData();
    const dpi = localStorage.getItem("dpi");

    formData.append("file", blob, `${tipo}.jpg`);
    formData.append("tipo", tipo);
    formData.append("dpi", dpi);
    try {
      const res = await fetch(`${iaApiHost}/validar-orientacion/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const valido = data.valido === true;

      if (!valido) {
        setEstadoAngulo(
          "Mueve ligeramente tu cabeza para mejorar la posición."
        );
      }

      return valido;
    } catch (err) {
      toast.error("Error al verificar la orientación.");
      return false;
    }
  };

  const subirFoto = async () => {
    if (fotosCapturadas.length < 3) {
      alert("Debes capturar las 3 fotos.");
      return;
    }

    setCargando(true);
    const dpi = localStorage.getItem("dpi");
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    for (const { tipo, file } of fotosCapturadas) {
      formData.append(`foto_${tipo}`, file, `${tipo}.jpg`);
    }

    await fetch(`${backendHost}/api/v1/usuario/fotos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setTimeout(() => {
      window.location.href = "/portal/mis-asignaciones";
    }, 3000);
  };

  const intentarDeNuevo = () => {
    setFotosCapturadas([]);
    setEstadoAngulo("Reiniciando cámara. Colócate frente al dispositivo.");
    setCamaraActiva(false);
    setTemporizadorActivo(false);
    setTimeout(() => iniciarCamara(), 500);
  };

  const IconoFaceID = () => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      className="text-gray-400"
    >
      <path
        d="M7 2H5C3.89543 2 3 2.89543 3 4V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 2H19C20.1046 2 21 2.89543 21 4V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 22H19C20.1046 22 21 21.1046 21 20V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 22H5C3.89543 22 3 21.1046 3 20V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 14C9.33333 15.3333 10.6667 16 12 16C13.3333 16 14.6667 15.3333 15 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );

  const Spinner = () => (
    <div className="flex flex-col items-center gap-2 text-gray-600">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium">Subiendo tus fotos...</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4 px-4 max-w-xl mx-auto">
      {cargando ? (
        <Spinner />
      ) : (
        <>
          <div className="rounded-full p-1 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 shadow-lg">
            <div
              className={`w-[300px] h-[300px] rounded-full overflow-hidden bg-white flex items-center justify-center border-4 transition-all duration-500 ${
                camaraActiva
                  ? estadoAngulo?.includes("correctamente") ||
                    estadoAngulo?.includes("activada")
                    ? "border-green-500"
                    : "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${camaraActiva ? "block" : "hidden"}`}
                autoPlay
                muted
                playsInline
              />
              {!camaraActiva && <IconoFaceID />}
            </div>
          </div>

          <p className="text-lg text-gray-700 font-medium text-center">
            {fotosCapturadas.length === 3
              ? "Todas las capturas se han realizado exitosamente."
              : `Preparando captura: ${tipos[fotosCapturadas.length]?.replace("_", " ") || ""}`}
          </p>

          {estadoAngulo && (
            <p
              className={`text-sm font-medium text-center ${
                estadoAngulo.includes("correctamente") ||
                estadoAngulo.includes("activada")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {estadoAngulo}
            </p>
          )}

          {fotosCapturadas.length === 3 && (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between gap-4">
                <button
                  onClick={subirFoto}
                  disabled={cargando}
                  className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-500 transition mt-2"
                >
                  Confirmar y Continuar
                </button>
                <button
                  onClick={intentarDeNuevo}
                  disabled={cargando}
                  className="w-full bg-[#1a1a1a] text-white py-3 rounded-full font-semibold hover:bg-[#333] transition mt-2"
                >
                  Reintentar Capturas
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {fotosCapturadas.map((foto) => (
                  <img
                    key={foto.tipo}
                    src={foto.url}
                    alt={foto.tipo}
                    className="w-full h-28 object-cover rounded-xl shadow"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
