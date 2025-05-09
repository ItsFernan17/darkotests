"use client";

import { useState } from "react";

const faqs = [
  [
    "¿Cómo ingreso al sistema para realizar mi evaluación?",
    "Debes iniciar sesión con tu usuario y contraseña. Luego, verás tus asignaciones disponibles, ya sea para un nuevo puesto o para el proceso de ingreso a la empresa. Finalmente, haz clic en 'Realizar evaluación' para comenzar.",
  ],
  [
    "¿Qué pasa si no veo exámenes asignados?",
    "Asegúrate de que tu cuenta esté activa o contacta a tu evaluador para verificar la asignación.",
  ],
  [
    "¿El sistema guarda automáticamente mis respuestas?",
    "Sí, cada vez que seleccionas una respuesta, esta se guarda en tiempo real.",
  ],
  [
    "¿Qué ocurre si pierdo conexión a Internet?",
    "El sistema intentará reconectarse. Es recomendable evitar conexiones inestables durante el examen.",
  ],
  [
    "¿Puedo modificar una respuesta antes de finalizar el examen?",
    "Sí. Puedes volver a cualquier pregunta antes de presionar 'Finalizar'.",
  ],
  [
    "¿Cuántos intentos tengo para realizar el examen?",
    "Depende de la configuración del evaluador. Por lo general, solo se permite un intento.",
  ],
  [
    "¿Qué es una serie dentro del examen?",
    "Es una agrupación de preguntas por tema. Por ejemplo: Serie I (Conocimientos Generales), Serie II (Específicos).",
  ],
  [
    "¿Cómo sé si terminé correctamente el examen?",
    "Verás una pantalla de confirmación indicando que fue enviado correctamente.",
  ],
  [
    "¿Puedo ver mi punteo al finalizar?",
    "Sí, al finalizar el examen podrás ver tu punteo. Además, podrás generar una constancia como comprobante de que realizaste la evaluación.",
  ],

  [
    "¿El examen tiene límite de tiempo?",
    "Puede tenerlo o no, dependiendo de cómo lo configure la institución. Si se habilita el tiempo, verás un temporizador en pantalla. En caso contrario, podrás realizar el examen sin restricción temporal.",
  ],

  [
    "¿Qué tipo de preguntas puede contener?",
    "Puede incluir opción múltiple, verdadero/falso, respuesta corta, entre otros.",
  ],
  [
    "¿El sistema detecta si cambio de pestaña?",
    "Sí. El sistema puede registrar si abandonas la ventana del navegador durante el examen.",
  ],
  [
    "¿Puedo repetir un examen si fallé?",
    "Dependerá del número de intentos configurado. Consulta con tu evaluador.",
  ],
  [
    "¿Puedo usar mi celular para evaluar?",
    "Dependerá de la institución y sus normas. Algunas permiten realizar el examen desde un dispositivo móvil, pero se recomienda el uso de una computadora para mayor estabilidad y mejor experiencia.",
  ],

  [
    "¿Qué pasa si accidentalmente cierro el navegador?",
    "El sistema guarda tu avance. Podrás continuar si el tiempo sigue vigente.",
  ],
  [
    "¿Puedo navegar entre preguntas libremente?",
    "Sí. Puedes desplazarte libremente entre las preguntas (scrollear) e ir y volver cuantas veces desees antes de finalizar el examen.",
  ],

  [
    "¿Hay alguna forma de practicar antes del examen real?",
    "Si el evaluador lo permite, puedes recibir exámenes de práctica desde la plataforma.",
  ],
  [
    "¿Qué sucede si hago trampa durante el examen?",
    "Tu intento puede ser bloqueado y reportado al evaluador. Se recomienda seguir las normas establecidas.",
  ],
  [
    "¿El sistema tiene reconocimiento facial?",
    "Puede integrarse con sistemas de validación facial, si está configurado por tu institución.",
  ],
  [
    "¿Cómo puedo obtener soporte técnico?",
    "En la parte inferior del sistema encontrarás un enlace de contacto para soporte.",
  ],
];

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map(([question, answer], index) => {
        const isActive = index === activeIndex;
        return (
          <div key={index} className=" transition-all duration-300 bg-white">
            <button
              onClick={() => toggle(index)}
              className={`w-full px-5 py-4 flex justify-between items-center text-2xl font-medium text-left transition-colors rounded-t-lg ${
                isActive ? "bg-[#f0f0f0]" : "bg-white hover:bg-[#f5f5f5]"
              }`}
            >
              <span>{question}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`bg-white px-5 pt-0 text-lg text-gray-700 overflow-hidden transition-all duration-300 ${
                isActive ? "max-h-40 opacity-100 py-3" : "max-h-0 opacity-0"
              }`}
            >
              {answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
