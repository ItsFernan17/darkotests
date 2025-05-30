import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaceVerifier } from "./FaceVerifier";
import { backendHost } from "../../utils/apiHost"; 

export function DoExamen() {
  const [examen, setExamen] = useState(null);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [dpi, setDpi] = useState(null);
  const [codigoAsignacion, setCodigoAsignacion] = useState(null);
  useEffect(() => {
    if (!examen) return;

    const codigoAsignacion = localStorage.getItem("codigo_asignacion");

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        fetch(`${backendHost}/api/v1/examen/advertencia`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mensaje: "Intento de cambio de pestaña o ventana.",
            dpi: localStorage.getItem("dpi"),
            fecha: new Date().toISOString(),
            codigo_asignacion: codigoAsignacion,
          }),
        });

        toast.warn(
          "Cambio de pestaña detectado. No se permite salir del examen."
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examen]);
  useEffect(() => {
    const valorDpi = localStorage.getItem("dpi");
    if (valorDpi) setDpi(valorDpi);

    const valorAsignacion = localStorage.getItem("codigo_asignacion");
    if (valorAsignacion) setCodigoAsignacion(valorAsignacion);
  }, []);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      fetch(`${backendHost}/api/v1/examen/advertencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: "Cambió de pestaña o minimizó",
          dpi: localStorage.getItem("dpi"),
          fecha: new Date().toISOString(),
        }),
      });
    }
  };

  const handleStartExam = async () => {
    const codigo_examen = localStorage.getItem("codigo_examen");
    if (!codigo_examen) {
      toast.error("No se encontró el código del examen.");
      return;
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    try {
      const response = await fetch(
        `${backendHost}/api/v1/examen-master/informacion/${codigo_examen}`
      );
      const data = await response.json();
      setExamen(data);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  const handleFinishExam = async () => {
    const codigo_examen = localStorage.getItem("codigo_examen");
    const codigo_asignacion = localStorage.getItem("codigo_asignacion");

    if (!codigo_examen || !codigo_asignacion) {
      toast.error("No se encontraron códigos en localStorage.");
      return;
    }

    let totalScore = 0;
    let allQuestionsAnswered = true;

    examen.series.forEach((serie, serieIndex) => {
      serie.preguntas.forEach((pregunta, preguntaIndex) => {
        const selectedAnswer = document.querySelector(
          `input[name="pregunta-${serieIndex}-${preguntaIndex}"]:checked`
        );

        if (selectedAnswer) {
          const selectedValue = selectedAnswer.value;
          const correctAnswer = pregunta.respuestas.find(
            (respuesta) => respuesta.esCorrecta
          );
          if (
            correctAnswer &&
            selectedValue === correctAnswer.descripcion_respuesta
          ) {
            totalScore += parseFloat(pregunta.punteo_pregunta);
          }
        } else {
          allQuestionsAnswered = false;
        }
      });
    });

    if (!allQuestionsAnswered) {
      toast.error(
        "Debes contestar todas las preguntas antes de finalizar el examen."
      );
      return;
    }

    setTotalScore(totalScore);

    try {
      const response = await fetch(
        `${backendHost}/api/v1/asignacion/${codigo_asignacion}/punteo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ punteo: totalScore }),
        }
      );

      if (response.ok) {
        // ✅ Eliminar listeners molestos
        window.onbeforeunload = null;
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );

        localStorage.removeItem("codigo_examen");
        localStorage.removeItem("codigo_asignacion");

        setIsCompletedModalOpen(true);

        setTimeout(() => {
          window.location.assign("/portal/mis-asignaciones");
        }, 5000);
      } else {
        const errorData = await response.json();
        console.error("Error en la respuesta:", errorData);
        toast.error("Error al actualizar el punteo.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error en la solicitud. Revisa la consola.");
    }
  };

  const handleCloseModal = () => {
    setIsCompletedModalOpen(false);
    window.location.assign("/portal/menu-sistema");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <ToastContainer />
      {!examen ? (
        <>
          <div className="relative z-10 flex flex-col items-center w-full px-6">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-md border border-[#E3E8F5] px-8 py-6 mb-10">
              <h2 className="text-xl font-semibold text-[#2d2c36] mb-4">
                Instrucciones Generales
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 text-justify">
                A continuación, deberá responder cuidadosamente cada pregunta
                seleccionando la opción que considere correcta.
                <span className="font-semibold text-[#FF6F61]">
                  {" "}
                  Si cierra esta ventana o abandona el examen, este será anulado
                  automáticamente.
                </span>{" "}
                Asegúrese de estar preparado antes de comenzar.
              </p>

              <h3 className="text-base font-semibold text-[#2d2c36] mb-3">
                Recomendaciones Técnicas
              </h3>

              <div className=" pl-5">
                <ul className="list-disc list-outside text-sm sm:text-base text-gray-700 space-y-3 text-justify leading-relaxed">
                  <li>
                    Elija un espacio tranquilo, con buena iluminación y sin
                    interrupciones.
                  </li>
                  <li>
                    La{" "}
                    <span className="font-medium text-[#2d2c36]">
                      cámara debe permanecer activa
                    </span>{" "}
                    en todo momento durante la evaluación. No se requiere
                    micrófono.
                  </li>
                  <li>
                    <span className="font-medium text-[#2d2c36]">
                      No cierre ni minimice esta ventana
                    </span>{" "}
                    mientras responde el examen.
                  </li>
                  <li>
                    Colóquese{" "}
                    <span className="font-medium text-[#2d2c36]">
                      frente a la cámara de su computadora
                    </span>
                    , evitando movimientos bruscos, recostarse, alejarse o
                    cubrir su rostro. El sistema requiere que su rostro
                    permanezca visible y centrado.
                  </li>
                  <li>
                    En caso de que{" "}
                    <span className="font-medium text-[#2d2c36]">
                      se detecte la cámara obstruida o una imagen borrosa
                    </span>
                    , el sistema mostrará un mensaje de advertencia. Si esto
                    ocurre{" "}
                    <span className="font-semibold">
                      tres veces consecutivas
                    </span>
                    , se considerará como una conducta irregular o intento de
                    ocultamiento.
                  </li>
                  <li>
                    <span className="text-[#FF6F61] font-semibold">
                      Al tercer evento de este tipo, el sistema anulará
                      automáticamente el examen por sospecha de suplantación de
                      identidad
                    </span>{" "}
                    o incumplimiento de las normas establecidas.
                  </li>
                  <li>
                    Este proceso de verificación facial es{" "}
                    <span className="font-semibold text-[#2d2c36]">
                      obligatorio
                    </span>{" "}
                    para garantizar transparencia, equidad y autenticidad
                    durante la evaluación.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center w-full px-6">
            <div className="mt-1 w-[900px]">
              <div className="text-center">
                <button
                  onClick={handleStartExam}
                  className="w-[260px] bg-[#1a1a1a] text-white py-3 rounded-full font-semibold hover:bg-[#333] transition"
                >
                  Iniciar Evaluación
                </button>
              </div>
            </div>
            <p className="text-sm text-center text-gray-600 max-w-md mt-4">
              ⚠️ Durante el examen, su rostro será monitoreado mediante la
              cámara. Asegúrese de tener buena iluminación y estar en un lugar
              tranquilo.
            </p>
          </div>
        </>
      ) : (
        <div className="w-full max-w-[900px] mt-4 space-y-10">
          {dpi && codigoAsignacion && (
            <FaceVerifier
              dpi={dpi}
              codigoAsignacion={codigoAsignacion}
              onAnular={() => {
                setTimeout(() => {
                  window.location.href = "/portal/mis-asignaciones";
                }, 5000);
              }}
            />
          )}

          {/* Información del Examen */}
          <div className="bg-white bg-opacity-100 rounded-xl border border-gray-300 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Fecha de Evaluación
                </p>
                <p className="text-base text-gray-900">
                  {examen.fecha_evaluacion || "No disponible"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Punteo Máximo
                </p>
                <p className="text-base text-gray-900">
                  {examen.punteo_maximo || "No disponible"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Motivo del Examen
                </p>
                <p className="text-base text-gray-900">
                  {examen.motivo_examen || "No disponible"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Tipo de Examen
                </p>
                <p className="text-base text-gray-900">
                  {examen.tipo_examen || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Series y Preguntas */}
          {examen.series &&
            examen.series.map((serie, serieIndex) => (
              <div
                key={serieIndex}
                className="bg-white bg-opacity-100 rounded-xl border border-gray-300 shadow-sm p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {serie.serie}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Instrucciones:</span>{" "}
                  {serie.instrucciones}
                </p>

                {serie.preguntas &&
                  serie.preguntas.map((pregunta, preguntaIndex) => (
                    <div key={preguntaIndex} className="mt-6">
                      <p className="text-md font-medium text-gray-800 mb-3">
                        {pregunta.descripcion_pregunta}
                      </p>
                      <div className="space-y-2">
                        {pregunta.respuestas &&
                          pregunta.respuestas.map(
                            (respuesta, respuestaIndex) => (
                              <label
                                key={respuestaIndex}
                                className="flex items-start space-x-3 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`pregunta-${serieIndex}-${preguntaIndex}`}
                                  value={respuesta.descripcion_respuesta}
                                  className="mt-1.5 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                  disabled={isExamFinished}
                                />
                                <span className="text-gray-700 text-sm">
                                  {respuesta.descripcion_respuesta}
                                </span>
                              </label>
                            )
                          )}
                      </div>
                    </div>
                  ))}
              </div>
            ))}

          {/* Botón Finalizar */}
          {!isExamFinished && (
            <div className="flex justify-center">
              <button
                onClick={handleFinishExam}
                className="w-[300px] bg-[#1a1a1a] text-white py-3 rounded-full font-semibold hover:bg-[#333] transition mt-2"
              >
                Finalizar Evaluación
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para mostrar que se ha completado el examen y redirigir */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow-inner">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#2d2c36] mb-2">
              ¡Examen Finalizado!
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Tu calificación ha sido registrada correctamente en el sistema.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Serás redirigido al menú principal en 5 segundos.
            </p>
            <div className="text-xs text-gray-400">Redireccionando…</div>
          </div>
        </div>
      )}
    </div>
  );
}
