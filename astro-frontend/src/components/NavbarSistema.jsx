import { useState, useRef, useEffect } from "react";
import { ListaMenuSistema } from "./items";
import ItemsMenuDesktopSistema from "./ItemsMenuDesktopSistema";
import MovilMenuSistema from "./MovilMenuSistema";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Navbar = () => {
  const [userDropdown, setUserDropdown] = useState(false);
  const userRef = useRef();
  const [userRole, setUserRole] = useState(null);
  const [fullName, setFullName] = useState("");

  const handleLogout = async () => {
    const role = localStorage.getItem("role");
    const dpi = localStorage.getItem("dpi");
    const token = localStorage.getItem("accessToken");

    // 🔥 Si es un evaluado, elimina las fotos del servidor FastAPI
    if (role === "evaluado" && dpi) {
      try {
        await fetch(`http://localhost:8000/eliminar-fotos-evaluado/${dpi}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // opcional si tu backend no lo requiere
          },
        });
        console.log(`🗑️ Fotos eliminadas del evaluado ${dpi}`);
      } catch (err) {
        console.error("❌ Error al eliminar las fotos del evaluado:", err);
      }
    }

    // 🧼 Limpieza de session/local storage
    localStorage.clear();
    sessionStorage.setItem("closedByUser", "true");

    // 🚪 Redirigir al login
    window.location.href = "/";
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    const dpi = localStorage.getItem("dpi");
    const token = localStorage.getItem("accessToken");

    setUserRole(role);

    if (dpi && token) {
      fetch(`http://localhost:3000/api/v1/usuario/${dpi}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo obtener el usuario");
          return res.json();
        })
        .then((data) => {
          setFullName(data.nombre_completo || "Nombre no disponible");
        })
        .catch((error) => {
          console.error("Error al obtener el nombre del usuario:", error);
        });
    }
  }, []);

  return (
    <header className="relative w-full text-[#2d2c36] text-[14px]">
      <div className="h-[65px] flex items-center bg-[#f9f8f9] w-full shadow-sm">
        <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3 lg:-translate-x-14">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-9 h-9"
              >
                {/* Círculo incompleto */}
                <path
                  d="M21 12C21 7.03 16.97 3 12 3C9.05 3 6.47 4.64 5.1 7"
                  stroke="#5673E0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 12C3 16.97 7.03 21 12 21C14.95 21 17.53 19.36 18.9 17"
                  stroke="#FF6F61"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Check marcado */}
                <path
                  d="M9 12.5L11 14.5L15 10"
                  stroke="#2D2C36"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#2d2c36] whitespace-nowrap">
              DarkoTests
            </h1>
          </div>

          <ul className="lg:flex hidden gap-x-1 justify-center flex-1 space-x-2">
            {ListaMenuSistema.map((lista) => (
              <ItemsMenuDesktopSistema
                lista={lista}
                userRole={userRole}
                key={lista.name}
              />
            ))}
          </ul>

          <div className="lg:hidden z-[999]">
            <MovilMenuSistema
              ListaMenuSistema={ListaMenuSistema}
              userRole={userRole}
            />
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex flex-col items-center lg:translate-x-[50px]"
            >
              <img
                src="/profile.webp"
                alt="Perfil"
                className="w-[55px] h-[55px] rounded-full shadow cursor-pointer object-cover"
              />
            </button>
          </div>

          <AnimatePresence>
            {userDropdown && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed top-0 right-0 w-[300px] h-full bg-white z-50 shadow-lg p-6"
              >
                {/* Botón cerrar (X) */}
                <div className="flex justify-end">
                  <button onClick={() => setUserDropdown(false)}>
                    <X className="w-6 h-6 text-gray-500 hover:text-black" />
                  </button>
                </div>

                <div className="flex flex-col items-center mt-10">
                  <img
                    src="/profile.webp"
                    alt="Perfil"
                    className="w-32 h-32 rounded-full shadow mb-4 object-cover"
                  />
                  <h2 className="text-xl font-bold">{fullName}</h2>
                  <p className="text-sm text-gray-500 mb-6">Rol: {userRole}</p>

                  <div className="bg-[#f9f8f9] rounded-lg p-3 w-full text-center mb-6">
                    <p className="text-sm text-gray-600">Estado del sistema:</p>
                    <p className="text-sm font-medium text-green-600">
                      Conectado
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-[#FF6F61] text-white rounded-md shadow hover:bg-red-600 transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      <div className="w-full flex">
        <div className="w-full h-[2px] bg-[#eaebe8]"></div>
      </div>
    </header>
  );
};

export default Navbar;
