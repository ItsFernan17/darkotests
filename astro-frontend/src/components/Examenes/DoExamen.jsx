import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function DoExamen() {
  const [examen, setExamen] = useState(null);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  useEffect(() => {
    const codigo_examen = localStorage.getItem('codigo_examen');
    const userRole = localStorage.getItem('role');

    if (!codigo_examen) {
      if (userRole === 'evaluador') {
        setIsUnauthorized(true);
        setTimeout(() => {
          window.location.assign("/portal/mis-asignaciones");
        }, 5000);
      } else {
        setIsUnauthorized(true);
        setTimeout(() => {
          window.location.assign("/login");
        }, 5000);
      }
    }
  }, []);

  const handleStartExam = async () => {
    const codigo_examen = localStorage.getItem('codigo_examen');
    if (!codigo_examen) {
      toast.error("No se encontró el código del examen.");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/v1/examen-master/informacion/${codigo_examen}`);
      const data = await response.json();
      setExamen(data);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  const handleFinishExam = async () => {
    const codigo_examen = localStorage.getItem('codigo_examen');
    const codigo_asignacion = localStorage.getItem('codigo_asignacion');
    
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

          const correctAnswer = pregunta.respuestas.find((respuesta) => respuesta.esCorrecta);
          if (correctAnswer && selectedValue === correctAnswer.descripcion_respuesta) {
            totalScore += parseFloat(pregunta.punteo_pregunta);
          }
        } else {
          allQuestionsAnswered = false;
        }
      });
    });
  
    if (!allQuestionsAnswered) {
      toast.error("Debes contestar todas las preguntas antes de finalizar el examen.");
      return;
    }
  
    setTotalScore(totalScore);
  
    try {
      const response = await fetch(`http://localhost:3000/api/v1/asignacion/${codigo_asignacion}/punteo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ punteo: totalScore }),
      });
  
      if (response.ok) {
        toast.success("¡Calificación Registrada en el Sistema!");
        localStorage.removeItem('codigo_examen');
        localStorage.removeItem('codigo_asignacion');
  
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

      {/* Modal si no hay un código de examen */}
      {isUnauthorized && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] rounded-lg shadow-lg">
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold text-[25px]">
                Examen No Asignado
              </h2>
              <img src="/EMDN1.png" alt="Logo" className="h-14" />
            </div>
            <div className="p-6 text-center">
              <p className="text-lg text-primary mb-8">
                No se encontró el código del examen. Redirigiendo al menú principal...
              </p>
            </div>
          </div>
        </div>
      )}

      {!examen ? (
        <div className="mt-8 w-[900px]">
          <p className="font-bold text-[20px] text-primary">
            Instrucciones generales:{" "}
            <span className="font-normal">
              Conteste las siguientes preguntas seleccionando las respuestas correctas. Si cierra este examen en el navegador, quedará automáticamente anulado.
            </span>
          </p>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleStartExam}
              className="bg-[#142957] font-normal text-white border-2 border-transparent rounded-[20px] text-lg cursor-pointer transition duration-300 ease-in-out h-[50px] w-[85%] lg:w-[300px] hover:bg-white hover:text-primary hover:border-primary"
            >
              Iniciar Evaluación
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[900px] mt-2 space-y-10">
          {/* Información del Examen */}
          <div className="bg-white p-7 rounded-lg border shadow-sm">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center">
                <span className="font-bold text-[20px] text-primary">Fecha de Evaluación:</span>
                <span className="ml-2 text-[20px]">{examen.fecha_evaluacion || "No disponible"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-[20px] text-primary">Punteo:</span>
                <span className="ml-2 text-[20px]">{examen.punteo_maximo || "No disponible"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-[20px] text-primary">Motivo del Examen:</span>
                <span className="ml-2 text-[20px]">{examen.motivo_examen || "No disponible"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-[20px] text-primary">Tipo de Examen:</span>
                <span className="ml-2 text-[20px]">{examen.tipo_examen || "No disponible"}</span>
              </div>
            </div>
          </div>

          {/* Series del Examen */}
          {examen.series && examen.series.map((serie, serieIndex) => (
            <div key={serieIndex} className="bg-white p-7 rounded-lg border shadow-sm mt-8">
              <h3 className="text-[20px] font-bold text-primary">{serie.serie}</h3>
              <p className="text-[18px] text-primary mt-2">
                <span className="font-bold">Instrucciones:</span> {serie.instrucciones}
              </p>

              {/* Preguntas de la Serie */}
              {serie.preguntas && serie.preguntas.map((pregunta, preguntaIndex) => (
                <div key={preguntaIndex} className="mt-6">
                  <p className="font-semibold text-[18px] text-primary">{pregunta.descripcion_pregunta}</p>
                  <div className="mt-3 grid grid-cols-3 gap-x-4">
                    {pregunta.respuestas && pregunta.respuestas.map((respuesta, respuestaIndex) => (
                      <label key={respuestaIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`pregunta-${serieIndex}-${preguntaIndex}`}
                          value={respuesta.descripcion_respuesta}
                          className="appearance-none border border-primary rounded-full w-5 h-5 checked:bg-primary checked:border-transparent checked:shadow-md transition-all duration-300 ease-in-out cursor-pointer"
                          disabled={isExamFinished}
                        />
                        <span className="text-primary">{respuesta.descripcion_respuesta}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Botón para finalizar la evaluación */}
          {!isExamFinished && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleFinishExam}
                className="bg-[#142957] font-normal text-white border-2 border-transparent rounded-[20px] text-lg cursor-pointer transition duration-300 ease-in-out h-[50px] w-[85%] lg:w-[300px] hover:bg-white hover:text-primary hover:border-primary"
              >
                Finalizar Evaluación
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para mostrar que se ha completado el examen y redirigir */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] rounded-lg shadow-lg">
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold text-[25px]">
                Examen Finalizado
              </h2>
              <img src="/EMDN1.png" alt="Logo" className="h-14" />
            </div>

            <div className="p-6 text-center">
              <p className="text-lg text-primary mb-8">
                Has finalizado el examen y tu punteo ha sido actualizado. Serás redirigido al menú principal en 5 segundos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

