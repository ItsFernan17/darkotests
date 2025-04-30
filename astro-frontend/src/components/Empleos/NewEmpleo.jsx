import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createEmpleo, updateEmpleo } from "./Empleo.api";

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
          `http://localhost:3000/api/v1/empleo/${ceom}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
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
          toast.error("Error: Datos inválidos, revise la información ingresada", {
            autoClose: 2500,
          });
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
              <strong>¡Empleo creado exitosamente!</strong>
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
          toast.error("Error: El empleo con el CEOM proporcionado ya existe en la base de datos", {
            autoClose: 2500,
          });
        } else if (error.message.includes("El empleo con el CEOM proporcionado ya existe en la base de datos")) {
          toast.error("Error: El empleo con el CEOM proporcionado ya existe en la base de datos", {
            autoClose: 2500,
          });
        } else if (error.message.includes("descripcion")) {
          toast.error("Error: La descripción debe tener mínimo 10 caracteres", {
            autoClose: 2500,
          });
        } else if (error.message.includes("datos inválidos")) {
          toast.error("Error: Datos inválidos, revise la información ingresada", {
            autoClose: 2500,
          });
        } else {
          toast.error("Error al crear el empleo, intente nuevamente", {
            autoClose: 2500,
          });
        }
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
            htmlFor="ceom"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            CEOM
          </label>
          <input
            type="text"
            id="ceom"
            className="bg-[#F7FAFF] h-[34px] w-[318px] mt-1 rounded-sm border border-primary pl-3 font-page"
            placeholder="Ejemplo: E71A20"
            disabled={!!ceom}
            {...register("ceom", {
              required: "*CEOM es requerido",
              minLength: {
                value: 4,
                message: "*CEOM debe tener al menos 4 caracteres",
              },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "*CEOM solo debe contener letras y números",
              },
            })}
          />
          {errors.ceom && (
            <p className="text-red-900 text-sm mb-0">{errors.ceom.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="descripcion"
            className="block font-page text-[16px] font-semibold text-primary"
          >
            Descripción
          </label>
          <input
            type="text"
            id="descripcion"
            className="bg-[#F7FAFF] h-[34px] w-[318px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
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
            <p className="text-red-900 text-sm mb-0">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div className="col-span-full flex justify-center">
          {ceom ? (
            <div className="flex justify-end space-x-4 mb-3 w-full">
              <button
                type="submit"
                className="bg-[#0f763d] mt-2 font-bold font-page mb-2 text-white border-2 border-transparent rounded-[10px] text-[16px] cursor-pointer transition duration-300 ease-in-out h-[35px] w-[150px] md:w-[120px] hover:bg-white hover:text-[#0f763d] hover:border-[#0f763d]"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={onClose}
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
                Crear Empleo
              </button>
              {toastMessage && <div>{toastMessage}</div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
