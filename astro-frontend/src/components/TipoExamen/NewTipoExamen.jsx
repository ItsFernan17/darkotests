import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTipoExamen, updateTipoExamen } from "./TipoExamen.api";
import Empleo from "./Empleo";
import { FileText } from "lucide-react";
import { backendHost } from "../../utils/apiHost"; 

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

  const resetSelectRef = React.useRef(null);

  useEffect(() => {
    const fetchTipoExamenData = async () => {
      if (codigo_tipoE) {
        try {
          const token = localStorage.getItem("accessToken");
          const tipoExamenResponse = await fetch(
            `http://${backendHost}:3000/api/v1/tipo-examen/${codigo_tipoE}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
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
    if (codigo_tipoE) {
      try {
        await updateTipoExamen(codigo_tipoE, {
          descripcion: dataTipoExamen.descripcion,
          ceom: dataTipoExamen.ceom,
          usuario_modifica: localStorage.getItem("usuario"),
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
          usuario_ingreso: localStorage.getItem("usuario"),
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={onSubmit}
      >
        <div className="mt-[2px]">
          <label htmlFor="ceom" className={labelClass}>
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
          <label htmlFor="descripcion" className={labelClass}>
            Descripción
          </label>
          <InputWithIcon
            icon={FileText}
            id="descripcion"
            placeholder="Descripción del tipo de examen"
            {...register("descripcion", {
              required: "*La descripción es requerida",
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
            className="bg-[#1a1a1a] text-white py-3 w-[200px]  rounded-full font-semibold hover:bg-[#333] transition mt-2"
          >
            {codigo_tipoE ? "Actualizar Tipo Examen" : "Crear Tipo Examen"}
          </button>
        </div>
      </form>
    </div>
  );
}