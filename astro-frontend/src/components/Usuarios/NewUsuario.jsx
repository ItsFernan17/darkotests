import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Departamentos from "../Departamentos";
import { createUsuario, updateUsuario } from "./Usuario.api";
import Roles from "./Roles";
import { User, Phone, Lock, FileText } from "lucide-react";
import { backendHost } from "../../utils/apiHost";

export function NewUsuario({
  usuario = null,
  onClose = null,
  onUserSaved = null,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [toastMessage, setToastMessage] = useState(null);
  const resetDepartamentoRef = React.useRef(null);
  const resetRolesRef = React.useRef(null);

  useEffect(() => {
    const fetchUsuarioData = async () => {
      if (usuario) {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(
            `${backendHost}/api/v1/usuario/${usuario}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            reset({
              dpi: data.dpi,
              nombre_completo: data.nombre_completo,
              telefono: data.telefono,
            });
          } else {
            toast.error("Error al cargar los datos del usuario");
          }
        } catch {
          toast.error("Error al cargar los datos del usuario");
        }
      }
    };
    fetchUsuarioData();
  }, [usuario, reset]);

  const handleErrors = (error) => {
    const msg = error.message;
    if (msg.includes("usuario ya existe")) toast.error("DPI ya registrado");
    else if (msg.includes("nombre_completo"))
      toast.error("Nombre demasiado corto");
    else if (msg.includes("telefono")) toast.error("Teléfono inválido");
    else if (msg.includes("contraseña")) toast.error("Contraseña débil");
  };

  const onSubmit = handleSubmit(async (dataUsuario) => {
    const token = localStorage.getItem('accessToken');
    
    if (usuario) {
      try {
        const response = await updateUsuario(usuario, {
          dpi: dataUsuario.dpi,
          nombre_completo: dataUsuario.nombre_completo,
          telefono: dataUsuario.telefono,
          password: dataUsuario.password,
          rol: dataUsuario.role,
          residencia: parseInt(dataUsuario.residencia),
          grado: parseInt(dataUsuario.grado),
          poblacion: parseInt(dataUsuario.poblacion),
          comando: parseInt(dataUsuario.comando),
        });
  
        if (response.error) {
          throw new Error(response.error);
        }
  
        toast.success("¡Usuario actualizado exitosamente!", {
          autoClose: 1500,
        });
  
        setTimeout(() => {
          onUserSaved();
          onClose();
          reset();
          resetDepartamentoRef.current();
          resetRolesRef.current();
        }, 1500);
  
      } catch (error) {
        handleErrors(error);
      }
  
    } else {
      try {
        const response = await createUsuario({
          dpi: dataUsuario.dpi,
          nombre_completo: dataUsuario.nombre_completo,
          telefono: dataUsuario.telefono,
          password: dataUsuario.password,
          role: dataUsuario.role,
          residencia: parseInt(dataUsuario.residencia),
          grado: parseInt(dataUsuario.grado),
          poblacion: parseInt(dataUsuario.poblacion),
          comando: parseInt(dataUsuario.comando),
        });
  
        if (response.error) {
          throw new Error(response.error);
        }
  
        const usuarioResponse = await fetch(
          `${backendHost}/api/v1/usuario/${dataUsuario.dpi}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
  
        if (usuarioResponse.ok) {
          const usuarioData = await usuarioResponse.json();
          const nombreUsuario = usuarioData.nombre_usuario;
  
          toast.success(
            <div>
              <strong>¡Usuario creado exitosamente!</strong>
              <p>
                <strong>1. DPI:</strong> {dataUsuario.dpi}
              </p>
              <p>
                <strong>2. Usuario:</strong> {nombreUsuario}
              </p>
              <p>
                <strong>3. Nombre:</strong> {dataUsuario.nombre_completo}
              </p>
            </div>,
            {
              autoClose: 2500,
              render: (message) => (
                <div dangerouslySetInnerHTML={{ __html: message }} />
              ),
            }
          );
  
          reset();
          resetDepartamentoRef.current();
          resetRolesRef.current();
        }
      } catch (error) {
        handleErrors(error);
      }
    }
  });

  const inputClass =
    "bg-[#f3f1ef] border border-gray-300 text-sm rounded-xl focus:ring-primary focus:border-primary block w-full px-10 py-2.5";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";
  const iconClass =
    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400";

  const InputWithIcon = React.forwardRef(
    ({ icon: Icon, id, placeholder, ...props }, ref) => (
      <div className="relative">
        <div className={iconClass}>
          <Icon size={16} />
        </div>
        <input
          id={id}
          placeholder={placeholder}
          className={inputClass}
          ref={ref}
          {...props}
        />
      </div>
    )
  );

  return (
    <div>
      <ToastContainer />
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label htmlFor="dpi" className={labelClass}>
            DPI
          </label>
          <InputWithIcon
            icon={FileText}
            id="dpi"
            placeholder="1234567891234"
            {...register("dpi", {
              required: "DPI es requerido",
              minLength: { value: 13, message: "Debe tener 13 dígitos" },
              maxLength: { value: 13, message: "Debe tener 13 dígitos" },
              pattern: { value: /^[0-9]+$/, message: "Solo números" },
            })}
            disabled={!!usuario}
          />
          {errors.dpi && (
            <p className="text-sm text-red-600 mt-1">{errors.dpi.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="nombre_completo" className={labelClass}>
            Nombre Completo
          </label>
          <InputWithIcon
            icon={User}
            id="nombre_completo"
            placeholder="Nombre y Apellido"
            {...register("nombre_completo", {
              required: "Requerido",
              minLength: { value: 5, message: "Mínimo 5 caracteres" },
            })}
          />
          {errors.nombre_completo && (
            <p className="text-sm text-red-600 mt-1">
              {errors.nombre_completo.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="telefono" className={labelClass}>
            Teléfono
          </label>
          <InputWithIcon
            icon={Phone}
            id="telefono"
            placeholder="12345678"
            {...register("telefono", {
              required: "Teléfono requerido",
              minLength: { value: 8, message: "Mínimo 8 dígitos" },
              maxLength: { value: 10, message: "Máximo 10 dígitos" },
              pattern: { value: /^[0-9]+$/, message: "Solo números" },
            })}
          />
          {errors.telefono && (
            <p className="text-sm text-red-600 mt-1">
              {errors.telefono.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Contraseña
          </label>
          <InputWithIcon
            icon={Lock}
            id="password"
            placeholder="********"
            type="password"
            {...register("password", {
              required: "Requerida",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Rol</label>
          <Roles
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetRolesRef}
          />
        </div>
        <div>
          <label className={labelClass}>Departamento</label>
          <Departamentos
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetDepartamentoRef}
          />
        </div>

        <div className="col-span-full flex justify-center mt-6 mb-6">
          <button
            type="submit"
            className=" bg-[#1a1a1a] text-white py-3 w-[200px]  rounded-full font-semibold hover:bg-[#333] transition mt-2"
          >
            {usuario ? "Actualizar Usuario" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
