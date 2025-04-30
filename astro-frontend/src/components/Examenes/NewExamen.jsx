import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import Pregunta from "./Pregunta";
import TipoExamen from "./TipoExamen";
import Serie from "./Series";
import { createExamen } from "./Examen.api";
import { updateExamen } from "./Examen.api";
import TipoMotivo from "./TipoMotivo";

export function NewExamen({
  codigo_examen = null,
  onClose = null,
  onUserSaved = null,
}) {
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

  const resetTipoExamenRef = React.useRef(null);
  const resetMotivoExamenRef = React.useRef(null);

  function getToken() {
    return localStorage.getItem('accessToken'); // Obtener el token del localStorage
  }
  
  useEffect(() => {
    const fetchExamenData = async () => {
      if (codigo_examen) {
        try {
          const token = getToken(); // Obtener el token
  
          const examenResponse = await fetch(
            `http://localhost:3000/api/v1/examen-master/informacion/${codigo_examen}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`, // Agregar el token en la cabecera
                'Content-Type': 'application/json', // Especificar el tipo de contenido
              },
            }
          );
  
          if (examenResponse.ok) {
            const examenData = await examenResponse.json();
            reset({
              fecha: examenData ? examenData.fecha_evaluacion : "",
              punteo: examenData ? examenData.punteo_maximo : "",
            });
          }
        } catch (error) {
          toast.error("Error al cargar los datos del examen");
        }
      }
    };
  
    fetchExamenData();
  }, [codigo_examen, reset]);
  

  const {
    fields: seriesFields,
    append: appendSeries,
    remove: removeSeries,
  } = useFieldArray({
    control,
    name: "series",
  });

  const [toastMessage, setToastMessage] = useState(null);

  const onSubmit = handleSubmit(async (dataExamen) => {
    if (codigo_examen) {
      try {
        // Crear el JSON para la actualización
        const updateExamenData = {
          tipo_examen: parseInt(dataExamen.tipo_examen, 10),
          fecha_evaluacion: dataExamen.fecha,
          motivo: parseInt(dataExamen.motivo, 10),
          punteo_maximo: parseFloat(dataExamen.punteo),
          estado: true,
          usuario_ingreso: localStorage.usuario, // Ajustar el usuario de ingreso si es dinámico
          series: dataExamen.series.map((serie) => ({
            serie: Number(serie.serie),
            preguntas: serie.preguntas.map((pregunta) => ({
              pregunta: Number(pregunta), // Convertir cada pregunta a número
            })),
          })),
        };

        // Llamar a la función para actualizar el examen
        await updateExamen(codigo_examen, updateExamenData);

        toast.success("Examen actualizado exitosamente!", { autoClose: 1500 });
        setTimeout(() => {
          onUserSaved();
          onClose();
          resetMotivoExamenRef.current();
          resetTipoExamenRef.current();
        }, 1500);
      } catch (error) {
        toast.error("Error al actualizar el examen, intente nuevamente");
        console.error("Error al actualizar el examen:", error);
      }
    } else {
      try {
        // Validación para asegurarse de que cada serie tenga al menos una pregunta seleccionada
        if (dataExamen.series.some((serie) => serie.preguntas.length === 0)) {
          toast.error("Debes seleccionar al menos una pregunta por serie");
          return;
        }

        // Crear el examen (si no existe un codigo_examen)
        await createExamen({
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
        });

        toast.success("Examen creado exitosamente!");
        reset();
        resetMotivoExamenRef.current();
        resetTipoExamenRef.current();
      } catch (error) {
        console.error("Error al crear el examen:", error);
        toast.error("Error al crear el examen, intente nuevamente");
      } finally {
        reset();
        resetMotivoExamenRef.current();
        resetTipoExamenRef.current();
      }
    }
  });

  return (
    <div>
      <ToastContainer />
      <form className="gap-4 mt-2" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Fecha de Evaluación */}
          <div className="col-span-1">
            <label
              htmlFor="fecha"
              className="block text-[16px] font-page font-semibold text-primary"
            >
              Fecha de Evaluación
            </label>
            <input
              type="date"
              name="datetime"
              id="datetime"
              className="bg-[#F7FAFF] h-[38px] w-[320px] mt-1 rounded-sm border border-primary pl-3 font-page"
              placeholder="Ejemplo: 2024/12/31"
              {...register("fecha", {
                required: "*Fecha de Evaluación es requerida",
              })}
            />
            {errors.fecha && (
              <p className="text-red-900 text-sm mb-0">
                {errors.fecha.message}
              </p>
            )}
          </div>

          {/* Tipo de Examen */}
          <div className="col-span-1">
            <label
              htmlFor="tipo_examen"
              className="block text-[16px] font-page font-semibold text-primary"
            >
              Tipo de Examen
            </label>
            <TipoExamen
              register={register}
              errors={errors}
              setValue={setValue}
              resetSelectRef={resetTipoExamenRef}
            />
          </div>

          {/* Motivo del Examen */}
          <div className="col-span-1">
            <label
              htmlFor="motivo"
              className="block text-[16px] font-page font-semibold text-primary"
            >
              Motivo del Examen
            </label>
            <TipoMotivo
              register={register}
              errors={errors}
              setValue={setValue}
              resetSelectRef={resetMotivoExamenRef}
            />
          </div>

          {/* Punteo Máximo del Examen */}
          <div className="col-span-1">
            <label
              htmlFor="punteo"
              className="block font-page text-[16px] font-semibold text-primary"
            >
              Punteo Máximo del Examen
            </label>
            <input
              type="number"
              id="punteo"
              className="bg-[#F7FAFF] h-[38px] w-[320px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
              placeholder="100, 60, 50, 20, etc."
              step="0.1"
              {...register("punteo", {
                required: "*El Punteo es requerido",
                valueAsNumber: true, // Convierte automáticamente el valor a número
                validate: (value) =>
                  !isNaN(value) || "*El punteo debe ser un número",
                min: { value: 0, message: "*El punteo no puede ser negativo" },
                max: {
                  value: 100,
                  message: "*El punteo no puede ser mayor a 100",
                },
              })}
            />
            {errors.punteo && (
              <p className="text-red-900 text-sm">{errors.punteo.message}</p>
            )}
          </div>
        </div>

        {/* Sección de Series */}
        <div className="col-span-full mt-4">
          <h3 className="text-[20px] font-page font-bold text-primary">
            Series del Examen
          </h3>
          {seriesFields.map((seriesItem, seriesIndex) => (
            <div key={seriesItem.id} className="w-full relative mt-4">
              {/* Línea horizontal de separación para series */}
              {seriesIndex > 0 && (
                <hr className="my-6 border-t border-gray-300" />
              )}

              <div className="flex items-center justify-between">
                <label className="block text-[18px] font-page font-semibold text-primary">
                  Serie No. {seriesIndex + 1}
                </label>
              </div>

              <Serie
                register={register}
                name={`series[${seriesIndex}].serie`}
                errors={errors}
                className="w-full"
                seriesIndex={seriesIndex}
                setValue={setValue}
              />

              {/* Sección de Preguntas dentro de cada Serie */}
              <div className="mt-7 w-full">
                <label className="text-[18px] font-page font-bold text-primary">
                  Preguntas
                </label>

                {/* Componente Pregunta con checkbox */}
                <Pregunta
                  register={register}
                  name={`series[${seriesIndex}].preguntas`}
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                />
              </div>

              {/* Botón para eliminar la serie, no se muestra en la Serie 1 */}
              {seriesIndex > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSeries(seriesIndex)}
                    className="text-red-500 hover:text-red-700 flex items-center mt-4"
                  >
                    <FaTrash className="mr-1" />
                    Eliminar Serie
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => appendSeries({ serie: "", preguntas: [] })}
          className="text-primary font-bold w-auto flex items-center mt-4"
        >
          <FaPlus className="mr-1" />
          Agregar Serie
        </button>

        <div className="col-span-full flex justify-center">
          {codigo_examen ? (
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
                Crear Examen
              </button>
              {toastMessage && <div>{toastMessage}</div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
