import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAsignacion, updateAsignacion } from "./Asignaciones.api";
import Examen from "./Examen";
import Evaluado from "./Evaluado";

export function NewAsignacion({
  codigo_asignacion = null,
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
  const [examenData, setExamenData] = useState(null);
  const [codigoExamen, setCodigoExamen] = useState(null);

  const resetExamenRef = React.useRef(null);
  const resetEvaluadoRef = React.useRef(null);

  useEffect(() => {
    const fetchExamenData = async () => {
      if (codigoExamen) {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(
            `http://localhost:3000/api/v1/examen/${codigoExamen}`, 
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
  
          if (response.ok) {
            const data = await response.json();
            setExamenData(data);
          } else {
            toast.error("Error al cargar los datos del examen");
          }
        } catch (error) {
          toast.error("Error al conectar con el servidor");
        }
      }
    };
  
    fetchExamenData();
  }, [codigoExamen]);
  

  useEffect(() => {
    const fetchEmpleoData = async () => {
      if (codigo_asignacion) {
        try {
          const token = localStorage.getItem('accessToken');
          const empleoResponse = await fetch(
            `http://localhost:3000/api/v1/asignacion/${codigo_asignacion}`, 
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (empleoResponse.ok) {
            const empleoData = await empleoResponse.json();
            reset({
              codigo_examen: empleoData.examen.codigo_examen,
              evaluado: empleoData.evaluado.dpi,
            });
            setCodigoExamen(empleoData.examen.codigo_examen);
          } else {
            toast.error("Error al cargar los datos del empleo");
          }
        } catch (error) {
          toast.error("Error al cargar los datos del empleo");
        }
      }
    };
  
    fetchEmpleoData();
  }, [codigo_asignacion, reset]);
  

  const handleErrors = (error) => {
    if (error.message.includes("Failed to fetch")) {
      toast.error("Error al conectar con el servidor. Verifica tu conexión.", {
        autoClose: 3000,
      });
    } else if (error.message.includes("El evaluado ya tiene este examen asignado.")) {
      toast.error("El evaluado ya tiene asignado este examen.", {
        autoClose: 3000,
      });
    } else if (error.message.includes("422")) {
      toast.error("Error: Datos inválidos. Revisa los campos y vuelve a intentarlo.", {
        autoClose: 3000,
      });
    } else {
      toast.error("Error inesperado. Intenta nuevamente.", {
        autoClose: 3000,
      });
    }
  };
  
  const onSubmit = handleSubmit(async (formData) => {
    if (codigo_asignacion) {
      try {
        await updateAsignacion(codigo_asignacion, {
          evaluado: formData.evaluado,
          examen: parseInt(formData.examen),
          usuario_modifica: localStorage.usuario,
        });
  
        toast.success("Asignación actualizada exitosamente!", {
          autoClose: 1500,
        });

        setTimeout(() => {
          onUserSaved();
          onClose();
          resetEvaluadoRef.current();
          resetExamenRef.current();
          reset(); 
        }, 1500);
      } catch (error) {
        console.error("Error al actualizar la asignación:", error);
        handleErrors(error);
      }
    } else {
      try {
        await createAsignacion({
          evaluado: formData.evaluado,
          examen: parseInt(formData.examen),
          usuario_ingreso: localStorage.usuario,
        });
  
        toast.success("Asignación creada exitosamente!", {
          autoClose: 1500,
        });

        reset();
        resetEvaluadoRef.current();
        resetExamenRef.current();

      } catch (error) {
        console.error("Error al crear la asignación:", error);
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
        <div className="mt-2">
          <label
            htmlFor="grado"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            Examen
          </label>
          <Examen
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetExamenRef}
          />
        </div>

        <div className="mt-2">
          <label
            htmlFor="grado"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            Evaluado
          </label>
          <Evaluado
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetEvaluadoRef}
          />
        </div>
        <div className="col-span-full flex justify-center">
          {codigo_asignacion ? (
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
                Crear Asignación
              </button>
              {toastMessage && <div>{toastMessage}</div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
