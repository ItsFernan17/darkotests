import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { CalendarDays, FileText, Percent } from "lucide-react";
import Pregunta from "./Pregunta";
import TipoExamen from "./TipoExamen";
import TipoMotivo from "./TipoMotivo";
import Serie from "./Series";
import { createExamen, updateExamen } from "./Examen.api";
import { backendHost } from "../../utils/apiHost"; 

// Estilos reutilizables
const inputClass =
  "bg-[#f3f1ef] border border-gray-300 text-sm rounded-xl focus:ring-primary focus:border-primary block w-full px-10 py-2.5";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const iconClass =
  "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400";

// Input con ícono
const InputWithIcon = forwardRef(({ icon: Icon, id, placeholder, ...props }, ref) => (
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
));

export function NewExamen({ codigo_examen = null, onClose = null, onUserSaved = null }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      series: [{ preguntas: [] }],
    },
  });

  const resetTipoExamenRef = useRef(null);
  const resetMotivoExamenRef = useRef(null);

  const [toastMessage, setToastMessage] = useState(null);

  const {
    fields: seriesFields,
    append: appendSeries,
    remove: removeSeries,
  } = useFieldArray({
    control,
    name: "series",
  });

  const getToken = () => localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchExamenData = async () => {
      if (codigo_examen) {
        try {
          const token = getToken();
          const response = await fetch(
            `${backendHost}/api/v1/examen-master/informacion/${codigo_examen}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            reset({
              fecha: data.fecha_evaluacion,
              punteo: data.punteo_maximo,
            });
          } else {
            throw new Error("No se pudo cargar el examen");
          }
        } catch (error) {
          toast.error("Error al cargar los datos del examen");
        }
      }
    };
    fetchExamenData();
  }, [codigo_examen, reset]);
  

  const onSubmit = handleSubmit(async (dataExamen) => {
    try {
      if (dataExamen.series.some((s) => s.preguntas.length === 0)) {
        toast.error("Cada serie debe tener al menos una pregunta");
        return;
      }

      const examenPayload = {
        tipo_examen: parseInt(dataExamen.tipo_examen, 10),
        fecha_evaluacion: dataExamen.fecha,
        motivo: parseInt(dataExamen.motivo, 10),
        punteo_maximo: parseFloat(dataExamen.punteo),
        estado: true,
        usuario_ingreso: localStorage.usuario,
        series: dataExamen.series.map((serie) => ({
          serie: Number(serie.serie),
          preguntas: serie.preguntas.map((pregunta) => ({
            pregunta: Number(pregunta),
          })),
        })),
      };

      if (codigo_examen) {
        await updateExamen(codigo_examen, examenPayload);
        toast.success("Examen actualizado exitosamente", { autoClose: 1500 });
      } else {
        await createExamen(examenPayload);
        toast.success("Examen creado exitosamente", { autoClose: 1500 });
      }

      setTimeout(() => {
        onUserSaved?.();
        onClose?.();
        reset();
        resetTipoExamenRef.current?.();
        resetMotivoExamenRef.current?.();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el examen. Intenta de nuevo.");
    }
  });

  return (
    <div>
      <ToastContainer />
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Fecha Evaluación */}
          <div>
            <label htmlFor="fecha" className={labelClass}>Fecha de Evaluación</label>
            <InputWithIcon
              icon={CalendarDays}
              id="fecha"
              type="date"
              {...register("fecha", { required: "*La fecha es obligatoria" })}
            />
            {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha.message}</p>}
          </div>

          {/* Tipo Examen */}
          <div>
            <label htmlFor="tipo_examen" className={labelClass}>Tipo de Examen</label>
            <TipoExamen
              register={register}
              errors={errors}
              setValue={setValue}
              resetSelectRef={resetTipoExamenRef}
            />
          </div>

          {/* Motivo */}
          <div>
            <label htmlFor="motivo" className={labelClass}>Motivo del Examen</label>
            <TipoMotivo
              register={register}
              errors={errors}
              setValue={setValue}
              resetSelectRef={resetMotivoExamenRef}
            />
          </div>

          {/* Punteo Máximo */}
          <div>
            <label htmlFor="punteo" className={labelClass}>Punteo Máximo</label>
            <InputWithIcon
              icon={Percent}
              id="punteo"
              type="number"
              placeholder="Ej: 100"
              step="0.1"
              {...register("punteo", {
                required: "*El punteo es obligatorio",
                valueAsNumber: true,
                min: { value: 0, message: "*Debe ser mayor o igual a 0" },
                max: { value: 100, message: "*Máximo permitido: 100" },
              })}
            />
            {errors.punteo && <p className="text-sm text-red-600 mt-1">{errors.punteo.message}</p>}
          </div>
        </div>

        {/* Series y Preguntas */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-primary mb-2">Series del Examen</h3>
          {seriesFields.map((item, index) => (
            <div key={item.id} className="mb-6 border rounded-xl p-4 shadow-sm bg-[#f9f9f9]">
              <h4 className="font-bold mb-3">Serie {index + 1}</h4>

              <Serie
                register={register}
                name={`series[${index}].serie`}
                errors={errors}
                seriesIndex={index}
                setValue={setValue}
              />

              <div className="mt-4">
                <label className="block font-medium mb-1">Preguntas</label>
                <Pregunta
                  register={register}
                  name={`series[${index}].preguntas`}
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                />
              </div>

              {index > 0 && (
                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() => removeSeries(index)}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                  >
                    <FaTrash /> Eliminar Serie
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendSeries({ serie: "", preguntas: [] })}
            className="text-primary font-bold flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Agregar Serie
          </button>
        </div>

        {/* Botones */}
        <div className="col-span-full flex justify-center mt-2 mb-6">
          <button
            type="submit"
            className="bg-[#1a1a1a] text-white py-3 w-[200px] rounded-full font-semibold hover:bg-[#333] transition"
          >
            {codigo_examen ? "Actualizar Examen" : "Crear Examen"}
          </button>
        </div>
      </form>
    </div>
  );
}