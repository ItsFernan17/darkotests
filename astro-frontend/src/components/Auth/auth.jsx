import React, { useEffect, useState } from "react";
import { FaBan } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { backendHost } from "../../utils/apiHost"; 

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken) return false;

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        if (!refreshToken) return false;

        const response = await fetch(
          `http://${backendHost}:3000/api/v1/auth/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!response.ok) {
          localStorage.clear();
          return false;
        }

        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }

      return true;
    } catch (err) {
      console.error("Error al verificar token:", err);
      localStorage.clear();
      return false;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const valid = await verifyToken();
      setIsAuthenticated(valid);
      setIsLoading(false);

      if (!valid) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    };

    checkSession();
  }, []);

  // Marcar cuando el usuario cierra la pestaña
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.setItem("closedByUser", "true");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  if (isLoading) {
    return <div className="text-center font-page">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white w-[700px] max-w-[90%] rounded-2xl shadow-2xl animate-[fadeInDown_0.5s_ease-out]">
          {/* Header con título y logo */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-t-2xl">
            <h2 className="text-2xl font-bold tracking-wide font-page">
              Acceso Denegado
            </h2>
          </div>

          {/* Cuerpo del mensaje */}
          <div className="px-8 py-6 text-center text-gray-800">
            <div className="w-24 h-24 mx-auto mb-5 animate-pulse">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
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
            <h1 className="text-3xl font-extrabold mb-2 font-page">
              DarkoTests
            </h1>
            <p className="text-lg font-semibold">
              Tu sesión expiró o no tienes permisos para continuar.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Serás redirigido automáticamente al login.
            </p>
          </div>

          {/* Footer opcional */}
          <div className="text-center text-sm text-gray-400 pb-4">
            © 2025 DarkoTests. Todos los derechos reservados.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
