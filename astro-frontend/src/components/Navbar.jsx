import { useState } from "react";
import { ListaMenu } from "./items";
import ItemsMenuDesktop from "./ItemsMenuDesktop";
import MovilMenu from "./MovilMenu";

const Navbar = () => {
  const [router] = useState(null);

  return (
    <header className="relative w-full text-[#2d2c36] text-[14px]">
      <div className="h-[55px] flex items-center bg-[#f9f8f9] w-full shadow-sm">
        <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-20 h-20"
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

            <h1 className="text-3xl font-bold text-[#2d2c36]">DarkoTests</h1>
          </div>

          <ul className="lg:flex hidden gap-x-1 justify-center flex-1">
            {ListaMenu.map((lista) => (
              <ItemsMenuDesktop lista={lista} key={lista.name} />
            ))}
          </ul>

          <div className="flex items-center gap-x-5">
            <a href="/login">
              <button
                className="z-[999] relative px-4 py-2 shadow rounded-xl flex items-center justify-center cursor-pointer
        bg-[#5673E0] text-white font-semibold
        hover:bg-[#FF6F61] 
        transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Iniciar Sesión
              </button>
            </a>
            <div className="lg:hidden z-[999]">
              <MovilMenu ListaMenu={ListaMenu} />
            </div>
          </div>
        </nav>
      </div>

      <div className="w-full flex">
        <div className="w-full h-[2px] bg-[#eaebe8]"></div>
      </div>
    </header>
  );
};

export default Navbar;
