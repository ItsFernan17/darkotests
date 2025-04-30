import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTipoExamen, updateTipoExamen } from "./TipoExamen.api";
import Empleo from "./Empleo";

export function NewTipoExamen({
  codigo_tipoE = null,
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

  const resetSelectRef = React.useRef(null);

  useEffect(() => {
    const fetchTipoExamenData = async () => {
      if (codigo_tipoE) {
        try {
          const token = localStorage.getItem('accessToken');
          const tipoExamenResponse = await fetch(
            `http://localhost:3000/api/v1/tipo-examen/${codigo_tipoE}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (tipoExamenResponse.ok) {
            const tipoExamenData = await tipoExamenResponse.json();
            reset({
              descripcion: tipoExamenData.description,
              ceom: tipoExamenData.ceom?.ceom,
            });
          } else {
            toast.error("Error al cargar los datos del tipo de examen");
          }
        } catch (error) {
          toast.error("Error al cargar los datos del tipo de examen");
        }
      }
    };

    fetchTipoExamenData();
  }, [codigo_tipoE, reset]);


  const onSubmit = handleSubmit(async (dataTipoExamen) => {
    console.log(dataTipoExamen);
    
    if (codigo_tipoE) {
      try {
        await updateTipoExamen(codigo_tipoE, {
          descripcion: dataTipoExamen.descripcion,
          ceom: dataTipoExamen.ceom,
          usuario_modifica: localStorage.getItem('usuario'), 
        });
  
        toast.success("Tipo de examen actualizado exitosamente!", {
          autoClose: 1500,
        });
  
        setTimeout(() => {
          onUserSaved(); 
          onClose();
          resetSelectRef.current();
        }, 1500);
  
      } catch (error) {
        toast.error(`Error al actualizar el tipo de examen: ${error.message}`);
      }
  
    } else {
      try {
        await createTipoExamen({
          descripcion: dataTipoExamen.descripcion,
          ceom: dataTipoExamen.ceom,
          usuario_ingreso: localStorage.getItem('usuario'),
        });
  
        toast.success("Tipo de examen creado exitosamente!", {
          autoClose: 2500,
        });
  
      } catch (error) {
        toast.error(`Error al crear el tipo de examen: ${error.message}`);
  
      } finally {
        reset();
        resetSelectRef.current();
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
        <div className="flex space-x-4 mt-4">
          <div>
            <label
              htmlFor="ceom"
              className="block font-page text-[16px] font-semibold text-primary"
            >
              CEOM
            </label>
            <Empleo
              register={register}
              errors={errors}
              setValue={setValue}
              resetSelectRef={resetSelectRef}
            />
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block font-page text-[16px] ml-5 font-semibold text-primary"
            >
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              className="bg-[#F7FAFF] h-[38px] w-[318px] mt-1 ml-5 rounded-sm shadow-sm border border-primary pl-3 font-page"
              placeholder="Descripción del tipo de examen"
              {...register("descripcion", {
                required: "*La descripción es requerida",
              })}
            />
            {errors.descripcion && (
              <p className="text-red-900 ml-5 text-sm">
                {errors.descripcion.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-full flex justify-center">
          {codigo_tipoE ? (
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
                Crear Tipo de Examen
              </button>
              {toastMessage && <div>{toastMessage}</div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
