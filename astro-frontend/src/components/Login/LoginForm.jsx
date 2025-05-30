import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import { backendHost } from "../../utils/apiHost"

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

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

  const subirFotosAlServidor = async (fotos, dpi) => {
    const keys = {
      foto_frente: "frente",
      foto_perfil_derecho: "perfil_derecho",
      foto_perfil_izquierdo: "perfil_izquierdo",
    };

    const token = localStorage.getItem("accessToken");

    for (const key in keys) {
      const url = fotos[key];

      if (typeof url === "string" && url.startsWith("/resources/pictures/")) {
        const formData = new FormData();
        formData.append("dpi", dpi);
        formData.append("tipo", keys[key]);

        try {
          const blob = await fetch(`http://${backendHost}:3000` + url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.blob());

          formData.append("file", blob, `${keys[key]}.jpg`);

          const resUpload = await fetch(
            `http://${backendHost}:8000/guardar-foto-evaluado/`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!resUpload.ok) {
            console.error(`❌ Falló al subir la foto tipo ${keys[key]}`);
          } else {
            console.log(`✅ Foto de tipo ${keys[key]} enviada a FastAPI`);
          }
        } catch (error) {
          console.error(
            `❌ Error al subir la foto de tipo ${keys[key]}:`,
            error
          );
        }
      }
    }
  };

  const handleLogin = async (data) => {
    toast.dismiss();

    try {
      const response = await fetch(`http://${backendHost}:3000/api/v1/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Usuario o contraseña incorrectos");
        return;
      }

      const responseData = await response.json();
      const { accessToken, refreshToken, usuario, dpi } = responseData;
      const role = getRoleFromJWT(accessToken);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("usuario", usuario);
      localStorage.setItem("role", role);
      localStorage.setItem("dpi", dpi);

      if (role === "evaluado") {
        try {
          const fotosResp = await fetch(
            `http://${backendHost}:3000/api/v1/usuario/${dpi}/mis-fotos`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          const fotosData = fotosResp.ok ? await fotosResp.json() : null;

          const camposEsperados = [
            "foto_frente",
            "foto_perfil_derecho",
            "foto_perfil_izquierdo",
          ];

          const tieneTodasLasFotos =
            fotosData &&
            camposEsperados.every((campo) => {
              const ruta = fotosData[campo];
              return (
                typeof ruta === "string" &&
                ruta.trim() !== "" &&
                ruta.trim().toLowerCase() !== "null" &&
                ruta.trim().toLowerCase() !== "undefined"
              );
            });

          if (tieneTodasLasFotos) {
            await subirFotosAlServidor(fotosData, dpi);
            window.location.href = "/portal/mis-asignaciones";
          } else {
            window.location.href = "/portal/mi-identidad";
          }
        } catch (error) {
          window.location.href = "/portal/mi-identidad";
        }
      } else {
        window.location.href = "/portal/menu-sistema";
      }
    } catch (error) {
      console.error(error);
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

      <div className="text-center mt-5 text-sm font-medium text-[#1a1a1a]">
        <p className="mb-1">¿Se te olvidó tu contraseña?</p>
      </div>
    </div>
  );
}
