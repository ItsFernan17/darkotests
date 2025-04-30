import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAsignacionExamen, updateAsignacionExamen } from "./Series.api"; // Asegúrate de tener las funciones de la API correspondientes

export function NewSerie({ codigo_serie = null, onClose = null, onUserSaved = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchSerieData = async () => {
      if (codigo_serie) {
        try {
          const token = localStorage.getItem('accessToken');
          const serieResponse = await fetch(`http://localhost:3000/api/v1/serie/${codigo_serie}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (serieResponse.ok) {
            const serieData = await serieResponse.json();
            reset({
              serie: serieData.nombre,
              instrucciones: serieData.instrucciones,
            });
          } else {
            const errorData = await serieResponse.json();
            throw new Error(errorData.message || "Error al cargar los datos de la serie");
          }
        } catch (error) {
          toast.error(`Error: ${error.message || "Error al cargar los datos de la serie"}`);
        }
      }
    };

    fetchSerieData();
  }, [codigo_serie, reset]);


  const onSubmit = handleSubmit(async (dataSerie) => {
    if (codigo_serie) {
      try {
        const response = await updateAsignacionExamen(codigo_serie, {
          nombre: dataSerie.serie,
          instrucciones: dataSerie.instrucciones,
          usuario_modifica: localStorage.usuario,
        });
        if (response.error) {
          throw new Error(response.error);
        }
        toast.success("¡Serie actualizada exitosamente!", { autoClose: 1500 });
        setTimeout(() => {
          onUserSaved();
          onClose();
          reset();
        }, 1500);
      } catch (error) {
        handleAPIError(error, "actualizar");
      }
    } else {
      try {
        const response = await createAsignacionExamen({
            nombre: dataSerie.serie,
            instrucciones: dataSerie.instrucciones,
            usuario_ingreso: localStorage.usuario,
        });

        if (response.error) {
          throw new Error(response.error);
        }
        
        reset();

        toast.success(
          <div>
            <strong>¡Serie creada exitosamente!</strong>
          </div>,
          {
            autoClose: 2500,
            render: (message) => (
              <div dangerouslySetInnerHTML={{ __html: message }} />
            ),
          }
        );

      } catch (error) {
        handleAPIError(error, "crear");
      }
    }
  });

  const handleAPIError = (error, action) => {
    if (error.message.includes("serie ya existe")) {
      toast.error("Error: La serie con el nombre proporcionado ya existe en la base de datos", { autoClose: 2500 });
    } else if (error.message.includes("serie")) {
      toast.error("Error: El nombre de la serie debe tener mínimo 3 caracteres", { autoClose: 2500 });
    } else if (error.message.includes("instrucciones")) {
      toast.error("Error: Las instrucciones deben tener mínimo 10 caracteres", { autoClose: 2500 });
    } else {
      toast.error(`Error al ${action} la serie, intente nuevamente`, { autoClose: 2500 });
    }
  };

  return (
    <div>
      <ToastContainer />
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
        onSubmit={onSubmit}
      >
        <div className="mt-4">
          <label
            htmlFor="serie"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            Serie
          </label>
          <input
            type="text"
            id="serie"
            className="bg-[#F7FAFF] h-[34px] w-[318px] mt-1 rounded-sm border border-primary pl-3 font-page"
            placeholder="Ejemplo: Serie II"
            {...register("serie", {
              required: "*La serie es requerida",
              minLength: {
                value: 3,
                message: "*La serie debe tener al menos 3 caracteres",
              },
              pattern: {
                value: /^[A-Za-z0-9\s]+$/,
                message: "*La serie solo debe contener letras, números y espacios",
              },
            })}
          />
          {errors.serie && (
            <p className="text-red-900 text-sm mb-0">{errors.serie.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="instrucciones"
            className="block font-page text-[16px] font-semibold text-primary"
          >
            Instrucciones
          </label>
          <input
            type="text"
            id="instrucciones"
            className="bg-[#F7FAFF] h-[34px] w-[318px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
            placeholder="Escribe las instrucciones para la serie"
            {...register("instrucciones", {
              required: "*Las instrucciones son requeridas",
              minLength: {
                value: 10,
                message: "*Las instrucciones deben tener al menos 10 caracteres",
              },
            })}
          />
          {errors.instrucciones && (
            <p className="text-red-900 text-sm mb-0">{errors.instrucciones.message}</p>
          )}
        </div>

        <div className="col-span-full flex justify-center">
          {codigo_serie ? (
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
                Crear Serie
              </button>
              {toastMessage && <div>{toastMessage}</div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
