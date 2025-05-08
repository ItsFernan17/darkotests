import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const ItemsMenuDesktop = ({ lista, userRole }) => {
  // ❌ Oculta si el rol no está autorizado
  if (lista.roles && !lista.roles.includes(userRole)) {
    return null;
  }

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: { duration: 0.3 },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -10,
      transition: { duration: 0.3 },
      transitionEnd: { display: "none" },
    },
  };

  const subMenu = lista?.submenu?.length > 0;
  const [isHover, setIsHover] = useState(false);

  const toggleHoverMenu = () => setIsHover(!isHover);

  return (
    <motion.li
      className="relative group/link flex flex-col items-center"
      onHoverStart={toggleHoverMenu}
      onHoverEnd={toggleHoverMenu}
    >
      <div className="flex items-center gap-1">
        <a
          href={lista.href}
          className="cursor-pointer text-[16px] font-semibold px-3 py-1 
            hover:text-[#FF6F61] text-[#2d2c36] transition-colors duration-300"
        >
          {lista.name}
        </a>
        {subMenu && (
          <ChevronDown className="text-[#2d2c36] w-4 h-4 group-hover/link:rotate-180 transition-transform duration-200" />
        )}
      </div>

      {subMenu && (
        <motion.div
          className="absolute top-full mt-3 flex flex-col items-center"
          initial="exit"
          animate={isHover ? "enter" : "exit"}
          variants={subMenuAnimate}
        >
          <div className="relative bg-white rounded-xl shadow-lg z-10 mt-[-6px]">
            <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-lg"></div>

            <div className="flex flex-col gap-2 py-2 px-4 w-60">
              {lista.submenu.slice(0, 5).map((subItem, i) => (
                <a
                  key={i}
                  href={subItem.href}
                  className="text-[#2d2c36] text-[15px] font-normal hover:text-[#5673E0] transition-colors"
                >
                  {subItem.text}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.li>
  );
};

export default ItemsMenuDesktop;
