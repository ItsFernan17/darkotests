import { Menu, X, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function MovilMenu({ ListaMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setIsClicked] = useState(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const subMenuDrawer = {
    enter: { height: "auto", opacity: 1, overflow: "hidden" },
    exit: { height: 0, opacity: 0, overflow: "hidden" },
  };

  return (
    <div>
      <button className="z-[999] relative" onClick={toggleDrawer}>
        {isOpen ? <X className="w-10 h-10" /> : <Menu className="w-10 h-10" />}
      </button>

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: isOpen ? "0%" : "100%", opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 left-auto h-full bg-white text-[#2d2c36] p-10 w-[380px] overflow-y-auto"
      >
        <ul className="space-y-8 mt-16">
          {ListaMenu?.map(({ name, subMenu, href }, i) => {
            const hasSubMenu = subMenu?.length > 0;
            const isClicked = clicked === i;
            return (
              <li key={name}>
                {hasSubMenu ? (
                  <div
                    className="flex justify-between items-center text-[22px] font-bold cursor-pointer transition hover:text-[#5673E0]"
                    onClick={() => setIsClicked(isClicked ? null : i)}
                  >
                    {name}
                    <ChevronRight
                      className={`ml-2 w-8 h-8 transform transition-transform duration-300 ${isClicked ? "rotate-90" : "rotate-0"}`}
                    />
                  </div>
                ) : (
                  <a
                    href={href}
                    className="block text-[22px] font-bold cursor-pointer transition hover:text-[#5673E0]"
                  >
                    {name}
                  </a>
                )}

                {hasSubMenu && (
                  <motion.ul
                    initial="exit"
                    animate={isClicked ? "enter" : "exit"}
                    variants={subMenuDrawer}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="ml-6 mt-4 space-y-4"
                  >
                    {subMenu?.map(({ name, href }) => (
                      <li key={name}>
                        <a
                          href={href}
                          className="block text-[18px] font-normal cursor-pointer transition hover:text-[#FF6F61]"
                        >
                          {name}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
