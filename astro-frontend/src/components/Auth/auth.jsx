import React, { useEffect, useState } from "react";
import { FaBan } from "react-icons/fa"; 

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);

      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white w-[700px] rounded-lg shadow-lg">
          <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
            <h2 className="font-page font-semibold items-center text-[25px]">
              No Autorizado
            </h2>
            <img src="/EMDN1.png" alt="Logo" className="h-14" />
          </div>
          <div className="p-6 text-center text-primary text-[20px] font-semibold">
            <FaBan size={50} className="text-red-500 mx-auto mb-4" />
            <p>No tienes acceso al sistema. Serás redirigido al login en unos segundos.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
