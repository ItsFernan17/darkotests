import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { backendHost } from "../utils/apiHost"; 

const PanelDerecho = () => {
  const [userRole, setUserRole] = useState(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const dpi = localStorage.getItem("dpi");
    const token = localStorage.getItem("accessToken");

    setUserRole(role);

    if (dpi && token) {
      fetch(`${backendHost}/api/v1/usuario/${dpi}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo obtener el usuario");
          return res.json();
        })
        .then((data) => {
          setFullName(data.nombre_completo || "Usuario");
        })
        .catch((error) => {
          console.error("Error al obtener el nombre del usuario:", error);
        });
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 content-start max-w-[480px]">
      {/* Panel de saludo con estilo ajustado */}
      <div className="rounded-xl overflow-hidden shadow-md border border-[#E3E8F5] bg-white">
        <div className="bg-[#4F6BED] text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="font-semibold text-lg tracking-wide">
            ¡Hola, {fullName}!
          </h2>
          <UserRound size={20} />
        </div>
        <div className="p-6 text-sm text-[#2E2E32] leading-relaxed space-y-2">
          <p>
            Desde aquí puedes acceder rápidamente a tus funciones clave, asignar
            o revisar exámenes, gestionar usuarios y más.
          </p>
          <p>
            Este sistema está diseñado para maximizar tu eficiencia y brindarte
            herramientas claras para una gestión confiable desde cualquier
            lugar.
          </p>
        </div>
      </div>

      {/* Panel To Do con tareas extendidas */}
      {/* Panel To Do con tareas extendidas y diseño atractivo */}
      <div className="bg-gradient-to-br from-white to-[#f9f9ff] rounded-2xl shadow-lg border border-[#dcdff0] p-6 flex flex-col gap-6 transition-all duration-300">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗓️</span>
          <h3 className="text-2xl font-bold text-[#2D2C36] tracking-tight">
            ¡Tu agenda de hoy!
          </h3>
        </div>
        <p className="text-sm text-gray-600 italic">
          "Organízate, prioriza y avanza paso a paso 🚀"
        </p>

        {userRole === "admin" && (
          <>
            <ul className="list-none text-sm text-gray-700 space-y-2 pl-2">
              <li>✅ Crear nuevos usuarios</li>
              <li>🔄 Actualizar roles de usuario</li>
              <li>📝 Revisar exámenes asignados</li>
              <li>✅ Autorizar solicitudes de evaluación</li>
              <li>🗓️ Configurar fechas límite</li>
              <li>📤 Exportar informes</li>
              <li>🧩 Asignar tareas a auxiliares</li>
              <li>⚙️ Modificar parámetros del sistema</li>
              <li>📊 Supervisar progreso de evaluaciones</li>
              <li>🚨 Revisar alertas del sistema</li>
            </ul>
          </>
        )}

        {userRole === "auxiliar" && (
          <>
            <ul className="list-none text-sm text-gray-700 space-y-2 pl-2">
              <li>
                ✅ Agregar nuevos miembros al equipo: auxiliares, evaluadores y
                evaluados
              </li>
              <li>📌 Verificar asignaciones recientes</li>
              <li>📋 Registrar asistencia</li>
              <li>🛠️ Actualizar estado de exámenes</li>
              <li>📦 Revisar entregas pendientes</li>
              <li>💬 Apoyar a usuarios</li>
              <li>📣 Enviar recordatorios</li>
              <li>📂 Revisar historial</li>
              <li>📈 Consultar estadísticas</li>
              <li>🏷️ Etiquetar exámenes</li>
              <li>🧐 Reportar inconsistencias</li>
            </ul>
          </>
        )}

        {userRole === "evaluador" && (
          <>
            <ul className="list-none text-sm text-gray-700 space-y-2 pl-2">
              <li>🆕 Crear nuevas asignaciones</li>
              <li>📋 Gestionar asignaciones existentes</li>
              <li>📝 Crear nuevos exámenes</li>
              <li>🗂️ Gestionar exámenes registrados</li>
              <li>❓ Crear preguntas para evaluaciones</li>
              <li>🛠️ Administrar preguntas existentes</li>
              <li>💼 Registrar nuevos empleos</li>
              <li>🏢 Gestionar empleos registrados</li>
              <li>📑 Crear tipos de examen</li>
              <li>🧩 Gestionar tipos de examen existentes</li>
            </ul>
          </>
        )}

        {!userRole && (
          <p className="text-sm text-gray-500 text-center animate-pulse">
            Cargando tareas... ⏳
          </p>
        )}
      </div>
    </div>
  );
};

export default PanelDerecho;
