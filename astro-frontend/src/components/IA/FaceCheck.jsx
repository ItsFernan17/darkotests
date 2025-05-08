import { useRef, useState, useEffect } from "react";
import { DoExamen } from "../Examenes/DoExamen";

export default function EvaluacionWrapper() {
  const [autorizado, setAutorizado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [capturas, setCapturas] = useState({
    izquierda: null,
    centro: null,
    derecha: null,
  });
  const [etapa, setEtapa] = useState("izquierda");
  const [validando, setValidando] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (mostrarModal && !stream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(() => console.error("No se pudo acceder a la cámara."));
    }
    if (!mostrarModal && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [mostrarModal]);

  const capturarImagen = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  const handleCaptura = () => {
    const nueva = capturarImagen();
    setCapturas((prev) => ({ ...prev, [etapa]: nueva }));
    if (etapa === "izquierda") setEtapa("centro");
    else if (etapa === "centro") setEtapa("derecha");
    else setEtapa("completo");
  };

  const handleValidar = () => {
    setValidando(true);
    setTimeout(() => {
      setValidando(false);
      setMostrarModal(false);
      setAutorizado(true);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 px-4">
      {!autorizado ? (
        <>
          <div className="text-center mb-8 w-full max-w-4xl">
          <h1 className="text-[40px] font-bold text-[#2d2c36] mb-4 leading-tight">
        Evaluación en Línea
      </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Antes de iniciar el examen, se realizará una detección de
              presencia en tiempo real mediante la cámara, validando que usted
              evaluado esté presente y sin uso de recursos externos durante el
              desarrollo de la evaluación.
            </p>
          </div>
          <button
            onClick={() => setMostrarModal(true)}
            className="w-[260px] bg-[#1a1a1a] text-white py-3 rounded-full font-semibold hover:bg-[#333] transition mt-4"
          >
            Iniciar
          </button>

          {mostrarModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
                <h2 className="text-xl font-bold text-center text-[#2d2c36] mb-2">
                  Verificación de Identidad
                </h2>

                {etapa !== "completo" && (
                  <p className="text-sm text-center text-gray-600 mb-4">
                    Mueva su rostro hacia la <strong>{etapa}</strong> y presione
                    capturar.
                  </p>
                )}

                <div className="rounded-full overflow-hidden border-[6px] border-[#FF6F61] mb-4 mx-auto w-64 h-64">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Mostrar capturas dentro del modal */}
                <div className="flex justify-center gap-3 mb-4 flex-wrap">
                  {Object.entries(capturas).map(
                    ([key, img]) =>
                      img && (
                        <div
                          key={key}
                          className="border-4 border-[#5673E0] rounded-xl overflow-hidden shadow-md"
                        >
                          <img
                            src={img}
                            alt={key}
                            className="w-20 h-16 object-cover"
                          />
                        </div>
                      )
                  )}
                </div>

                {etapa !== "completo" ? (
                  <button
                    onClick={handleCaptura}
                    className="w-full py-2 bg-[#2d2c36] text-white rounded-lg hover:bg-[#1f1f25] mb-3"
                  >
                    Capturar rostro hacia la {etapa}
                  </button>
                ) : (
                  <button
                    onClick={handleValidar}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    disabled={validando}
                  >
                    {validando ? "Validando..." : "Aceptar"}
                  </button>
                )}

                <button
                  onClick={() => setMostrarModal(false)}
                  className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <DoExamen />
      )}
    </div>
  );
}
