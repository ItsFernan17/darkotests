import React, { useEffect, useRef, useState } from "react";

export function FaceVerifier({ codigoAsignacion, onAnular }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [fallos, setFallos] = useState(0);
  const [borrosasConsecutivas, setBorrosasConsecutivas] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  const [esAnulacion, setEsAnulacion] = useState(false);

  const detenerCamaraYVerificacion = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const mostrarAdvertencia = (mensaje, definitiva = false) => {
    setMensajeModal(mensaje);
    setMostrarModal(true);
    setEsAnulacion(definitiva);
    if (!definitiva) {
      setTimeout(() => setMostrarModal(false), 6000);
    } else {
      detenerCamaraYVerificacion();
    }
  };

  const anularExamen = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/asignacion/${codigoAsignacion}/punteo`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ punteo: 0 }),
        }
      );
      if (response.ok && onAnular) onAnular();
    } catch {
    }
  };

  const verificarResultado = (data, minimoCoincidencias = 1, umbral = 0.6) => {
    if (!data?.verificaciones || !Array.isArray(data.verificaciones)) {
      return { valido: false, coincidencias: 0 };
    }

    const verificadas = data.verificaciones.filter((v) => v.verificado);
    const cantidad = verificadas.length;

    return {
      valido: cantidad >= minimoCoincidencias && data.distancia_min < umbral,
      coincidencias: cantidad,
    };
  };

  useEffect(() => {
    const iniciarVerificacion = async () => {
      try {
        const dpi = localStorage.getItem("dpi");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        setTimeout(() => {
          intervalRef.current = setInterval(async () => {
            try {
              const video = videoRef.current;
              if (!video || video.videoWidth === 0) return;

              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext("2d").drawImage(video, 0, 0);
              const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/jpeg")
              );

              const formData = new FormData();
              formData.append("dpi", dpi);
              formData.append("file", blob, "vivo.jpg");

              const res = await fetch("http://localhost:8000/verificar-identidad/", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();

              if (data?.motivo === "borrosidad") {
                setBorrosasConsecutivas((prev) => {
                  const nuevo = prev + 1;
                  if (nuevo >= 3) {
                    setFallos((prevFallos) => {
                      const nuevoFallo = prevFallos + 1;
                      if (nuevoFallo === 1) {
                        mostrarAdvertencia("La cámara ha sido obstruida o el ángulo no es correcto. Primer intento fallido.");
                      } else if (nuevoFallo === 2) {
                        mostrarAdvertencia("Segundo intento fallido. Asegúrese de estar bien visible y en posición frontal.");
                      } else if (nuevoFallo === 3) {
                        mostrarAdvertencia("El examen ha sido anulado por fallas consecutivas de visibilidad.", true);
                        anularExamen();
                      }
                      return nuevoFallo;
                    });
                    return 0;
                  } else {
                    mostrarAdvertencia("Por favor colóquese correctamente frente a la cámara.");
                    return nuevo;
                  }
                });
                return;
              }

              setBorrosasConsecutivas(0);

              const { valido } = verificarResultado(data, 1, 0.6);

              if (!valido) {
                setFallos((prev) => {
                  const nuevo = prev + 1;
                  if (nuevo === 1) {
                    mostrarAdvertencia("No se logró confirmar su identidad. Mantenga el rostro centrado.");
                  } else if (nuevo === 2) {
                    mostrarAdvertencia("Segundo intento fallido. Verifique su posición, luz y visibilidad.");
                  } else if (nuevo === 3) {
                    mostrarAdvertencia("Identidad no verificada. El examen ha sido anulado.", true);
                    anularExamen();
                  }
                  return nuevo;
                });
              }
            } catch {
            }
          }, 15000);
        }, 5000);
      } catch {
      }
    };

    iniciarVerificacion();
    return () => {
      detenerCamaraYVerificacion();
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        style={{ width: 1, height: 1, position: "absolute", opacity: 0.01, zIndex: -999 }}
        muted
        autoPlay
        playsInline
      />
      {mostrarModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-[400px] rounded-2xl shadow-2xl p-8 text-center animate-fade-in border border-gray-200">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#2d2c36] mb-2">
              {esAnulacion ? "Examen Anulado" : "Verificación Facial"}
            </h2>
            <p className="text-sm text-gray-700 mb-4">{mensajeModal}</p>
            <div className="text-xs text-gray-500">
              {esAnulacion
                ? "Redirigiendo por motivos de seguridad..."
                : "Se está evaluando la identidad del evaluado."}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
