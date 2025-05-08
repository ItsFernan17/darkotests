import { Menu, X, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MovilMenu({ ListaMenuSistema, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setIsClicked] = useState(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setIsClicked(null);
  };

  const subMenuDrawer = {
    enter: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // 🔐 Filtrar menú según el rol
  const menuFiltrado = ListaMenuSistema.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <div>
      {!isOpen && (
        <button className="z-[999] relative" onClick={toggleDrawer}>
          <Menu className="w-10 h-10" />
        </button>
      )}

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: isOpen ? "0%" : "100%", opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full bg-white text-[#2d2c36] p-10 w-[380px] overflow-y-auto z-[999]"
      >
        <div className="absolute top-4 right-4">
          <button onClick={toggleDrawer}>
            <X className="w-8 h-8 text-gray-500 hover:text-black transition" />
          </button>
        </div>
        <ul className="space-y-8 mt-16">
          {menuFiltrado.map(({ name, submenu, href }, i) => {
            const hasSubMenu = submenu?.length > 0;
            const isClicked = clicked === i;

            return (
              <li key={name}>
                {hasSubMenu ? (
                  <div
                    className="flex justify-between items-center text-[16px] font-bold cursor-pointer transition hover:text-[#5673E0]"
                    onClick={() => setIsClicked(isClicked ? null : i)}
                  >
                    {name}
                    <ChevronRight
                      className={`ml-2 w-8 h-8 transform transition-transform duration-300 ${
                        isClicked ? "rotate-90" : "rotate-0"
                      }`}
                    />
                  </div>
                ) : (
                  <a
                    href={href}
                    className="block text-[16px] font-bold cursor-pointer transition hover:text-[#5673E0]"
                    onClick={() => setIsOpen(false)}
                  >
                    {name}
                  </a>
                )}

                <AnimatePresence initial={false}>
                  {hasSubMenu && isClicked && (
                    <motion.ul
                      key={`submenu-${i}`}
                      initial="exit"
                      animate="enter"
                      exit="exit"
                      variants={subMenuDrawer}
                      className="ml-6 mt-4 space-y-4 overflow-hidden"
                    >
                      {submenu.map(({ text, href }) => (
                        <li key={text}>
                          <a
                            href={href}
                            className="block text-[14px] font-normal cursor-pointer transition hover:text-[#FF6F61]"
                            onClick={() => setIsOpen(false)}
                          >
                            {text}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
