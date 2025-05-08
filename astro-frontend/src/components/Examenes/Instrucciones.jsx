import React from "react";
import EvaluacionWrapper from "../../components/Examenes/EvaluacionWrapper";

export function Instrucciones() {
  return (
    <div  className="relative z-10 flex flex-col items-center w-full px-6">
      {" "}
      <div className="text-center mb-8 w-full max-w-4xl">
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          Antes de iniciar el examen, se realizará una detección de presencia en
          tiempo real mediante la cámara, validando que usted evaluado esté
          presente y sin uso de recursos externos durante el desarrollo de la
          evaluación.
        </p>
      </div>
      {/* Instrucciones */}
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-md border border-[#E3E8F5] px-8 py-6 mb-10">
        <h2 className="text-xl font-semibold text-[#2d2c36] mb-4">
          Instrucciones Generales
        </h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
          A continuación, deberá responder cuidadosamente cada pregunta
          seleccionando la opción correcta.
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
        <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-2 pl-2">
          <li>
            Elija un espacio tranquilo, con buena iluminación y sin
            interrupciones.
          </li>
          <li>
            La{" "}
            <span className="font-medium text-[#2d2c36]">
              cámara debe estar activa
            </span>{" "}
            cuando el sistema lo solicite. El micrófono no es necesario.
          </li>
          <li>
            <span className="font-medium text-[#2d2c36]">
              No cierre ni abandone esta ventana
            </span>{" "}
            mientras realiza el examen.
          </li>
          <li>
            Una vez confirmada su identidad, el sistema le mostrará
            automáticamente el contenido de la evaluación.
          </li>
          <li>
            Este proceso es{" "}
            <span className="font-semibold text-[#2d2c36]">obligatorio</span>{" "}
            para garantizar transparencia y equidad durante la evaluación.
          </li>
        </ul>
      </div>
      <EvaluacionWrapper />
      <p className="text-sm text-center text-gray-600 max-w-md mt-4">
        ⚠️ Durante el examen, su rostro será monitoreado mediante la cámara.
        Asegúrese de tener buena iluminación y estar en un lugar tranquilo.
      </p>
    </div>
  );
}
