import { useEffect, useState, useRef } from "react";
import { ChevronDown, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuClicked, setMenuClicked] = useState(null);
  const userRef = useRef();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const usuario = localStorage.getItem("usuario");
    setUserRole(role);
    setUserName(usuario);
  }, []);

  useEffect(() => {
    const closeDrawerOnResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setMenuClicked(null);
      }
    };
    window.addEventListener("resize", closeDrawerOnResize);
    return () => window.removeEventListener("resize", closeDrawerOnResize);
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setMenuClicked(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const ListaMenu = [
    { name: "Inicio", href: "/portal/menu-sistema" },
    {
      name: "Asignaciones",
      roles: ["admin", "evaluador"],
      submenu: [
        {
          text: "Nueva Asignación",
          href: "/portal/asignaciones/registrar-asignacion",
        },
        {
          text: "Ver Asignaciones",
          href: "/portal/asignaciones/gestionar-asignacion",
        },
      ],
    },
    {
      name: "Exámenes",
      roles: ["admin", "evaluador"],
      submenu: [
        { text: "Nuevo Examen", href: "/portal/examen/registrar-examen" },
        { text: "Ver Exámenes", href: "/portal/examen/gestionar-examenes" },
      ],
    },
    {
      name: "Preguntas",
      roles: ["admin", "evaluador"],
      submenu: [
        {
          text: "Nueva Pregunta",
          href: "/portal/preguntas/registrar-pregunta",
        },
        { text: "Ver Preguntas", href: "/portal/preguntas/gestionar-pregunta" },
      ],
    },
    {
      name: "Tipos de Examen",
      roles: ["admin", "evaluador"],
      submenu: [
        {
          text: "Nuevo Tipo",
          href: "/portal/tipoExamen/registrar-tipo-examen",
        },
        { text: "Ver Tipos", href: "/portal/tipoExamen/gestionar-tipo-examen" },
      ],
    },
    {
      name: "Empleos",
      roles: ["admin", "evaluador"],
      submenu: [
        { text: "Nuevo Empleo", href: "/portal/empleos/registrar-empleo" },
        { text: "Ver Empleos", href: "/portal/empleos/gestionar-empleos" },
      ],
    },
    {
      name: "Usuarios",
      roles: ["admin", "auxiliar"],
      submenu: [
        { text: "Nuevo Usuario", href: "/portal/usuarios/registrar-usuario" },
        { text: "Ver Usuarios", href: "/portal/usuarios/gestionar-usuarios" },
      ],
    },
  ];

  const subMenuDrawer = {
    enter: { height: "auto", opacity: 1, overflow: "hidden" },
    exit: { height: 0, opacity: 0, overflow: "hidden" },
  };

  return (
    <header className="relative w-full text-[#2d2c36] text-[14px]">
      <div className="h-[70px] flex items-center bg-[#f9f8f9] w-full shadow-sm">
        <nav className="w-full mx-auto px-6 lg:px-12 flex items-center justify-between">
          <a href="/portal/menu-sistema" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-20 h-20"
              >
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
                <path
                  d="M9 12.5L11 14.5L15 10"
                  stroke="#2D2C36"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#2d2c36]">DarkoTests</h1>
          </a>

          <ul className="hidden lg:flex gap-x-6 items-center">
            {ListaMenu.filter(
              (item) => !item.roles || item.roles.includes(userRole)
            ).map((item) => (
              <li
                key={item.name}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer text-[16px] font-semibold px-3 py-1 hover:text-[#FF6F61]">
                  <a href={item.href || "#"}>{item.name}</a>
                  {item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openDropdown === item.name ? "rotate-180" : ""}`}
                    />
                  )}
                </div>
                <AnimatePresence>
                  {openDropdown === item.name && item.submenu && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute mt-2 bg-white rounded-md shadow-lg py-2 w-48 z-50"
                    >
                      <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-md z-[-1]" />
                      {item.submenu.map((sub, index) => (
                        <li key={index}>
                          <a
                            href={sub.href}
                            className="block px-4 py-2 text-sm hover:bg-[#f1f5ff]"
                          >
                            {sub.text}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="lg:hidden">
            {!isOpen && (
              <button className="z-[999] relative" onClick={toggleDrawer}>
                <Menu className="w-10 h-10" />
              </button>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex flex-col items-center"
            >
              <img
                src="/profile.webp"
                alt="Perfil"
                className="w-[55px] h-[55px] rounded-full shadow cursor-pointer object-cover"
              />
            </button>
          </div>
        </nav>
      </div>

      {userDropdown && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 right-0 w-[300px] h-full bg-white z-50 shadow-lg p-6"
        >
          <div className="flex flex-col items-center mt-10">
            <img
              src="/profile.webp"
              alt="Perfil"
              className="w-32 h-32 rounded-full shadow mb-4 object-cover"
            />
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-sm text-gray-500 mb-6">Rol: {userRole}</p>

            <div className="bg-[#f1f5ff] rounded-lg p-3 w-full text-center mb-4">
              <p className="text-sm text-gray-600">Último ingreso:</p>
              <p className="text-sm font-semibold text-[#2d2c36]">
                hace 2 horas
              </p>
            </div>

            <div className="bg-[#f9f8f9] rounded-lg p-3 w-full text-center mb-6">
              <p className="text-sm text-gray-600">Estado del sistema:</p>
              <p className="text-sm font-medium text-green-600">Conectado</p>
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

      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 right-0 w-[300px] h-full bg-white z-[999] shadow-lg p-6 overflow-y-auto lg:hidden"
        >
          <div className="absolute top-4 right-4">
            <button onClick={toggleDrawer}>
              <X className="w-8 h-8 text-gray-500 hover:text-black" />
            </button>
          </div>

          <ul className="space-y-6 mt-20">
            {" "}
            {/* Ajustamos el margin-top para evitar que el X tape opciones */}
            {ListaMenu.filter(
              (item) => !item.roles || item.roles.includes(userRole)
            ).map((item, i) => {
              const hasSubMenu = item.submenu?.length > 0;
              const isClicked = menuClicked === i;
              return (
                <li key={item.name}>
                  <div
                    className="flex justify-between items-center text-[18px] font-semibold cursor-pointer hover:text-[#5673E0]"
                    onClick={() => setMenuClicked(isClicked ? null : i)}
                  >
                    {item.href ? (
                      <a href={item.href}>{item.name}</a>
                    ) : (
                      <span>{item.name}</span>
                    )}
                    {hasSubMenu && (
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${isClicked ? "rotate-90" : "rotate-0"}`}
                      />
                    )}
                  </div>
                  {hasSubMenu && (
                    <AnimatePresence>
                      {isClicked && (
                        <motion.ul
                          initial="exit"
                          animate="enter"
                          exit="exit"
                          variants={subMenuDrawer}
                          className="ml-4 mt-3 space-y-2"
                        >
                          {item.submenu.map((sub, j) => (
                            <li key={j}>
                              <a
                                href={sub.href}
                                className="block text-sm hover:text-[#FF6F61]"
                              >
                                {sub.text}
                              </a>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
      <AnimatePresence>
        {userDropdown && (
          <motion.div
            key="user-panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 right-0 w-[300px] h-full bg-white z-[999] shadow-lg p-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setUserDropdown(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-black" />
              </button>
            </div>
            <div className="flex flex-col items-center mt-4">
              <img
                src="/profile.webp"
                alt="Perfil"
                className="w-32 h-32 rounded-full shadow mb-4 object-cover"
              />
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-sm text-gray-500 mb-6">Rol: {userRole}</p>

              <div className="bg-[#f1f5ff] rounded-lg p-3 w-full text-center mb-4">
                <p className="text-sm text-gray-600">Fecha actual:</p>
                <p className="text-sm font-semibold text-[#2d2c36]">
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="bg-[#f9f8f9] rounded-lg p-3 w-full text-center mb-6">
                <p className="text-sm text-gray-600">Estado del sistema:</p>
                <p className="text-sm font-medium text-green-600">Conectado</p>
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

      <div className="w-full h-[2px] bg-[#eaebe8]" />
    </header>
  );
};

export default Navbar;
