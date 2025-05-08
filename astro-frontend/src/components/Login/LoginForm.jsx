import { FaUser, FaLock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 Limpieza si la sesión anterior fue cerrada manualmente o por cierre de pestaña
  useEffect(() => {
    if (sessionStorage.getItem("closedByUser") === "true") {
      localStorage.clear();
      sessionStorage.removeItem("closedByUser");
    }
  }, []);

  const getRoleFromJWT = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);
      return payload.role || payload.rol;
    } catch (error) {
      console.error("Error decodificando el JWT:", error);
      return null;
    }
  };

  const handleLogin = async (data) => {
    toast.dismiss();
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        const role = getRoleFromJWT(responseData.accessToken);

        localStorage.setItem("accessToken", responseData.accessToken);
        localStorage.setItem("refreshToken", responseData.refreshToken);
        localStorage.setItem("usuario", responseData.usuario);
        localStorage.setItem("role", role);
        localStorage.setItem("dpi", responseData.dpi);

        window.location.href =
          role === "evaluado"
            ? "/portal/mis-asignaciones"
            : "/portal/menu-sistema";
      } else {
        toast.error("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      toast.error("Ocurrió un error. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <form
        className="w-full flex flex-col items-center"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="w-full max-w-[360px] flex flex-col gap-5">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              E-mail asociado
            </label>
            <input
              type="text"
              {...register("usuario", {
                required: "El campo de usuario es obligatorio",
              })}
              className="w-[350px] px-4 py-3 rounded-xl bg-[#f3f1ef] text-sm focus:outline-none"
            />
            {errors.usuario && (
              <p className="text-red-600 text-sm">{errors.usuario.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Tu contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
                className="w-[350px] px-4 py-3 pr-10 rounded-xl bg-[#f3f1ef] text-sm focus:outline-none"
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-[#1a1a1a] text-white py-3 rounded-full font-semibold hover:bg-[#333] transition mt-2"
          >
            Inicia sesión
          </button>
        </div>
      </form>

      {/* Enlaces */}
      <div className="text-center mt-5 text-sm font-medium text-[#1a1a1a]">
        <p className="mb-1">¿Se te olvidó tu contraseña?</p>
      </div>
    </div>
  );
}
