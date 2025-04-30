import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Departamentos from "../Departamentos";
import Grado from "../Grado";
import Poblacion from "../Poblacion";
import Comando from "../Comando";
import { createUsuario, updateUsuario } from "./Usuario.api";
import Roles from "./Roles";

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
  const resetGradoRef = React.useRef(null);
  const resetPoblacionRef = React.useRef(null);
  const resetComandoRef = React.useRef(null);
  const resetRolesRef = React.useRef(null);

  function getToken() {
    return localStorage.getItem("accessToken");
  }
  
  useEffect(() => {
    const fetchUsuarioData = async () => {
      if (usuario) {
        try {
          const token = getToken();
  
          const usuarioResponse = await fetch(
            `http://localhost:3000/api/v1/usuario/${usuario}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (usuarioResponse.ok) {
            const usuarioData = await usuarioResponse.json();
            reset({
              dpi: usuarioData.dpi,
              nombre_completo: usuarioData.nombre_completo,
              telefono: usuarioData.telefono,
            });
          } else {
            toast.error("Error al cargar los datos del usuario");
          }
        } catch (error) {
          toast.error("Error al cargar los datos del usuario");
        }
      }
    };
  
    fetchUsuarioData();
  }, [usuario, reset]);


  const handleErrors = (error) => {
    if (error.message.includes("usuario ya existe")) {
      toast.error("Error: El usuario con este DPI ya existe", {
        autoClose: 2500,
      });
    } else if (error.message.includes("nombre_completo")) {
      toast.error(
        "Error: El nombre completo debe tener mínimo 5 caracteres",
        { autoClose: 2500 }
      );
    } else if (error.message.includes("telefono")) {
      toast.error("Error: El teléfono debe tener mínimo 8 caracteres", {
        autoClose: 2500,
      });
    } else if (error.message.includes("contraseña")) {
      toast.error("Error: La contraseña debe tener mínimo 8 caracteres", {
        autoClose: 2500,
      });
    } else if (error.message.includes("datos inválidos")) {
      toast.error(
        "Error: Datos inválidos, revise la información ingresada",
        { autoClose: 2500 }
      );
    } else {
      toast.error("Error al crear el usuario, intente nuevamente", {
        autoClose: 2500,
      });
    }
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
          resetGradoRef.current();
          resetPoblacionRef.current();
          resetComandoRef.current();
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
          `http://localhost:3000/api/v1/usuario/${dataUsuario.dpi}`, {
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
          resetGradoRef.current();
          resetPoblacionRef.current();
          resetComandoRef.current();
          resetRolesRef.current();
        }
      } catch (error) {
        handleErrors(error);
      }
    }
  });

  return (
    <div>
      <ToastContainer />
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
        onSubmit={onSubmit}
      >
        <div className="mt-4">
          <label
            htmlFor="dpi"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            DPI
          </label>
          <input
            type="text"
            id="dpi"
            className="bg-[#F7FAFF] h-[38px] w-[320px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
            placeholder="1234123451234"
            disabled={!!usuario}
            {...register("dpi", {
              required: "*DPI es requerido",
              minLength: {
                value: 13,
                message: "*El DPI debe tener 13 dígitos",
              },
              maxLength: {
                value: 13,
                message: "*El DPI debe tener 13 dígitos",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "*El DPI solo debe contener números",
              },
            })}
          />
          {errors.dpi && (
            <p className="text-red-900 text-sm mb-0">{errors.dpi.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="nombre"
            className="block font-page text-[16px] font-semibold text-primary"
          >
            Nombre Completo
          </label>
          <input
            type="text"
            id="nombre"
            className="bg-[#F7FAFF] h-[38px] w-[320px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
            placeholder="Nombres y Apellidos"
            {...register("nombre_completo", {
              required: "*Los Nombres y Apellidos son requeridos",
              validate: (value) => {
                const parts = value.trim().split(" ");
                return (
                  parts.length >= 2 ||
                  "*Debe incluir al menos nombre y apellido"
                );
              },
              minLength: {
                value: 5,
                message: "*El nombre completo debe tener al menos 5 caracteres",
              },
            })}
          />
          {errors.nombre_completo && (
            <p className="text-red-900 text-sm mb-0">
              {errors.nombre_completo.message}
            </p>
          )}
        </div>

        <div className="mt-2">
          <label
            htmlFor="telefono"
            className="block font-page text-[16px] font-semibold text-primary"
          >
            Número Telefónico
          </label>
          <input
            type="text"
            id="telefono"
            className="bg-[#F7FAFF] h-[38px] w-[318px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
            placeholder="1234-5678"
            {...register("telefono", {
              required: "*El Teléfono es requerido",
              minLength: {
                value: 8,
                message: "*El Teléfono debe tener al menos 8 dígitos",
              },
              maxLength: {
                value: 10,
                message: "*El Teléfono no debe exceder los 10 dígitos",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "*El Teléfono solo debe contener números",
              },
            })}
          />
          {errors.telefono && (
            <p className="text-red-900 text-sm">{errors.telefono.message}</p>
          )}
        </div>

        <div className="mt-2">
          <label
            htmlFor="contrasena"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            {usuario ? "Nueva Contraseña" : "Contraseña"}
          </label>
          <input
            type="password"
            id="contrasena"
            className="bg-[#F7FAFF] h-[38px] w-[318px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
            placeholder="ejemploNo1"
            {...register("password", {
              required: "*La Contraseña es requerida",
              minLength: {
                value: 8,
                message: "*La Contraseña debe tener al menos 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-900 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="mt-2">
          <label
            htmlFor="roles"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            {usuario ? "Rol del Usuario Actual" : "Rol del Usuario"}
          </label>
          <Roles
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetRolesRef}
          />
        </div>

        <div className="mt-2">
          <label
            htmlFor="departamento"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            {usuario ? "Departamento Actual" : "Departamento"}
          </label>
          <Departamentos
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetDepartamentoRef}
          />
        </div>

        <div className="mt-2">
          <label
            htmlFor="grado"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            {usuario ? "Grado Actual" : "Grado"}
          </label>
          <Grado
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetGradoRef}
          />
        </div>

        <div className="mt-2">
          <label
            htmlFor="poblacion"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            {usuario ? "Población Actual" : "Población"}
          </label>
          <Poblacion
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetPoblacionRef}
          />
        </div>

        <div className="mt-2">
          <label
            htmlFor="comando"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            {usuario ? "Comando Actual" : "Comando"}
          </label>
          <Comando
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetComandoRef}
          />
        </div>

        <div className="col-span-full flex justify-center">
          {usuario ? (
            <div className="flex justify-end space-x-4 mb-3 w-full">
              <button
                type="submit"
                className="bg-[#0f763d] mt-2 font-bold font-page mb-2 text-white border-2 border-transparent rounded-[10px] text-[16px] cursor-pointer transition duration-300 ease-in-out h-[35px] w-[150px] md:w-[120px] hover:bg-white hover:text-[#0f763d] hover:border-[#0f763d]"
              >
                Actualizar
              </button>
              <button
                onClick={onClose}
                type="button"
                className="bg-[#ED8080] mt-2 font-bold font-page mb-2 text-[#090000] border-2 border-transparent rounded-[10px] text-[16px] cursor-pointer transition duration-300 ease-in-out h-[35px] w-[150px] md:w-[120px] hover:bg-white hover:text-[#090000] hover:border-[#ED8080]"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <button
                type="submit"
                className="bg-[#142957] mt-2 font-normal font-page mb-10 text-white border-2 border-transparent rounded-[10px] text-[16px] cursor-pointer transition duration-300 ease-in-out  h-[40px] md:w-[300px]  hover:bg-white hover:text-primary hover:border-primary"
              >
                Crear Usuario
              </button>
              {toastMessage && <div>{toastMessage}</div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
