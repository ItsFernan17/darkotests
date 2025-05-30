import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createEmpleo, updateEmpleo } from "./Empleo.api";
import { FileText, Edit3 } from "lucide-react";
import { backendHost } from "../../utils/apiHost"; 

export function NewEmpleo({ ceom = null, onClose = null, onUserSaved = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [toastMessage, setToastMessage] = useState(null);

  // Función para obtener el token de localStorage
  function getToken() {
    return localStorage.getItem("accessToken");
  }

  useEffect(() => {
    const fetchEmpleoData = async () => {
      if (ceom) {
        try {
          const token = getToken();

          const empleoResponse = await fetch(
            `http://${backendHost}:3000/api/v1/empleo/${ceom}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (empleoResponse.ok) {
            const empleoData = await empleoResponse.json();
            reset({
              ceom: empleoData.ceom,
              descripcion: empleoData.descripcion,
            });
          } else {
            const errorData = await empleoResponse.json();
            throw new Error(
              errorData.message || "Error al cargar los datos del empleo"
            );
          }
        } catch (error) {
          toast.error(
            `Error: ${error.message || "Error al cargar los datos del empleo"}`
          );
        }
      }
    };

    fetchEmpleoData();
  }, [ceom, reset]);

  const onSubmit = handleSubmit(async (dataEmpleo) => {
    if (ceom) {
      try {
        const response = await updateEmpleo(ceom, {
          descripcion: dataEmpleo.descripcion,
          usuario_modifica: localStorage.usuario,
        });
        if (response.error) {
          throw new Error(response.error);
        }
        toast.success("¡Empleo actualizado exitosamente!", { autoClose: 1500 });
        setTimeout(() => {
          onUserSaved();
          onClose();
          reset();
        }, 1500);
      } catch (error) {
        if (error.message.includes("empleo no encontrado")) {
          toast.error("Error: Empleo no encontrado, verifique el CEOM", {
            autoClose: 2500,
          });
        } else if (error.message.includes("descripcion")) {
          toast.error("Error: La descripción debe tener mínimo 10 caracteres", {
            autoClose: 2500,
          });
        } else if (error.message.includes("datos inválidos")) {
          toast.error(
            "Error: Datos inválidos, revise la información ingresada",
            {
              autoClose: 2500,
            }
          );
        } else {
          toast.error("Error al actualizar el empleo, intente nuevamente", {
            autoClose: 2500,
          });
        }
      }
    } else {
      try {
        const response = await createEmpleo({
          ceom: dataEmpleo.ceom,
          descripcion: dataEmpleo.descripcion,
          usuario_ingreso: localStorage.usuario,
        });

        if (response.error) {
          throw new Error(response.error);
        }

        toast.success(
          <div>
            ¡Empleo creado exitosamente!
          </div>,
          {
            autoClose: 2500,
            render: (message) => (
              <div dangerouslySetInnerHTML={{ __html: message }} />
            ),
          }
        );
        reset();
      } catch (error) {
        if (error.message.includes("empleo ya existe")) {
          toast.error(
            "Error: El empleo con el CEOM proporcionado ya existe en la base de datos",
            {
              autoClose: 2500,
            }
          );
        } else if (
          error.message.includes(
            "El empleo con el CEOM proporcionado ya existe en la base de datos"
          )
        ) {
          toast.error(
            "Error: El empleo con el CEOM proporcionado ya existe en la base de datos",
            {
              autoClose: 2500,
            }
          );
        } else if (error.message.includes("descripcion")) {
          toast.error("Error: La descripción debe tener mínimo 10 caracteres", {
            autoClose: 2500,
          });
        } else if (error.message.includes("datos inválidos")) {
          toast.error(
            "Error: Datos inválidos, revise la información ingresada",
            {
              autoClose: 2500,
            }
          );
        } else {
          toast.error("Error al crear el empleo, intente nuevamente", {
            autoClose: 2500,
          });
        }
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
          <label htmlFor="ceom" className={labelClass}>
            CEOM
          </label>
          <InputWithIcon
            icon={FileText}
            id="ceom"
            placeholder="Ejemplo: E71A20"
            disabled={!!ceom}
            {...register("ceom", {
              required: "*CEOM es requerido",
              minLength: {
                value: 6,
                message: "*CEOM debe tener al menos 6 caracteres",
              },
              maxLength: {
                value: 8,
                message: "*CEOM no debe exceder los 8 caracteres",
              },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "*CEOM solo debe contener letras y números",
              },
            })}
          />

          {errors.ceom && (
            <p className="text-sm text-red-600 mt-1">{errors.ceom.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className={labelClass}>
            Descripción del Empleo
          </label>
          <InputWithIcon
            icon={Edit3}
            id="descripcion"
            placeholder="Descripción del Empleo"
            {...register("descripcion", {
              required: "*Descripción es requerida",
              minLength: {
                value: 10,
                message: "*La descripción debe tener al menos 10 caracteres",
              },
            })}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 mt-1">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div className="col-span-full flex justify-center mt-2 mb-6">
          <button
            type="submit"
            className=" bg-[#1a1a1a] text-white py-3 w-[200px]  rounded-full font-semibold hover:bg-[#333] transition mt-2"
          >
            {ceom ? "Actualizar Empleo" : "Crear Empleo"}
          </button>
        </div>
      </form>
    </div>
  );
}
