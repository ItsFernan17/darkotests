import { useState, useEffect } from "react";
import { DoExamen } from "./DoExamen";

export function EvaluacionWrapper() {
  const [autorizado, setAutorizado] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const codigo_examen = localStorage.getItem("codigo_examen");
    const userRole = localStorage.getItem("role");

    if (!codigo_examen) {
      setIsUnauthorized(true);
      setTimeout(() => {
        const redirect =
          userRole === "evaluado" ? "/portal/mis-asignaciones" : "/login";
        window.location.assign(redirect);
      }, 5000);
    }
  }, []);

  if (isUnauthorized) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white w-[400px] rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-[#2d2c36] mb-2">
            Acceso No Autorizado
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            No tienes un examen asignado o no cuentas con los permisos
            necesarios para acceder a esta evaluación.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Serás redirigido automáticamente al menú principal.
          </p>
          <div className="text-xs text-gray-400">Redireccionando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center">
      <DoExamen />
    </div>
  );
}
