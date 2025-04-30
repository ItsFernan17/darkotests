import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import TipoPregunta from "./TipoPregunta";
import { createPregunta, updatePregunta } from "./PreguntaRespuesta.api";

export function NewPreguntaRespuestas({
  id = null,
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

  } = useForm({
    defaultValues: {
      respuestas: [{ respuesta: "", esCorrecta: false }],
    },
  });

  const resetTipoPreguntaRef = React.useRef(null);
  

  const { fields, append, remove } = useFieldArray({
    control,
    name: "respuestas",
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchPreguntaData = async () => {
      if (id) {
        try {
          const token = localStorage.getItem('accessToken'); // Obtener el token de localStorage
  
          const preguntaResponse = await fetch(
            `http://localhost:3000/api/v1/pregunta-respuesta/preguntas/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                'Content-Type': 'application/json'
              }
            }
          );
  
          if (preguntaResponse.ok) {
            const preguntaData = await preguntaResponse.json();
  
            // Mapeamos las respuestas de la pregunta para poder mostrarlas
            const respuestasFormateadas = preguntaData.respuestas.map(
              (respuesta) => ({
                respuesta: respuesta.respuesta,
                esCorrecta: respuesta.esCorrecta === "Correcta", // Convertimos la respuesta a booleano
              })
            );
  
            reset({
              pregunta: preguntaData.descripcion,
              punteo: preguntaData.punteo,
              respuestas: respuestasFormateadas
            });
          }
        } catch (error) {
          toast.error("Error al cargar los datos de la pregunta");
        }
      }
    };
  
    fetchPreguntaData();
  }, [id, reset]);
  

  const onSubmit = handleSubmit(async (dataPregunta) => {
  if (id) {
    // Caso de actualización
    try {
      // Verifica que las respuestas existan
      if (!dataPregunta.respuestas || dataPregunta.respuestas.length === 0) {
        throw new Error("No hay respuestas para actualizar");
      }

      // Formatear las respuestas con usuario_modifica
      const respuestas = dataPregunta.respuestas.map((respuesta) => ({
        respuesta: respuesta.respuesta,
        esCorrecta: respuesta.esCorrecta || false,
        usuario_modifica: localStorage.usuario, // Asegurar que cada respuesta tiene este campo
      }));

      // Enviar el objeto de la pregunta junto con las respuestas
      await updatePregunta(id, {
        pregunta: {
          descripcion: dataPregunta.pregunta,
          tipo_pregunta: parseInt(dataPregunta.tipo_pregunta),
          punteo: dataPregunta.punteo,
          usuario_modifica: localStorage.usuario, // Incluimos usuario_modifica en la pregunta
        },
        respuestas: respuestas,
      });

      toast.success("Pregunta y Respuestas actualizadas exitosamente!", {
        autoClose: 1500,
      });

      setTimeout(() => {
        onUserSaved();
        onClose();
        resetTipoPreguntaRef.current();
      }, 1500);

    } catch (error) {
      console.error("Error al actualizar la pregunta: ", error); // Ver log en consola
      toast.error("Error al actualizar la pregunta, intente nuevamente");
    }
  } else {
    // Caso de creación
    try {
      // Verifica que las respuestas existan
      if (!dataPregunta.respuestas || dataPregunta.respuestas.length === 0) {
        throw new Error("No hay respuestas para registrar");
      }

      // Mapeamos las respuestas desde el formulario
      const respuestas = dataPregunta.respuestas.map((respuesta) => ({
        respuesta: respuesta.respuesta,
        esCorrecta: respuesta.esCorrecta || false,
      }));

      // Enviamos la pregunta creada
      await createPregunta({
        usuario_ingreso: localStorage.usuario,
        descripcion: dataPregunta.pregunta,
        punteo: dataPregunta.punteo,
        tipo_pregunta: parseInt(dataPregunta.tipo_pregunta),
        respuestas,
      });

      toast.success("¡Pregunta creada exitosamente!", { autoClose: 2500 });

      resetTipoPreguntaRef.current();
      reset({
        pregunta: "",
        punteo: 0,
        respuestas: [{ respuesta: "", esCorrecta: false }],
        tipo_pregunta: "0"
      });
      if (onUserSaved) onUserSaved();
    } catch (error) {
      console.error("Error al crear la pregunta: ", error); // Ver log en consola
      toast.error("Error al crear la pregunta, intente nuevamente");
    } finally {
      resetTipoPreguntaRef.current();
    }
  }
});


  return (
    <div>
      <ToastContainer />
      <form className="grid grid-cols-1 gap-4 mt-2" onSubmit={onSubmit}>
        <div className="mt-4 col-span-2">
          <label
            htmlFor="pregunta"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            Pregunta
          </label>
          <input
            type="text"
            id="pregunta"
            className="bg-[#F7FAFF] h-[38px] w-full mt-1 rounded-sm border border-primary pl-3 font-page"
            placeholder="Ejemplo: ¿Cuál es la misión del EMDN?"
            {...register("pregunta", { required: "*La Pregunta es requerida" })}
          />
          {errors.pregunta && (
            <p className="text-red-900 text-sm">{errors.pregunta.message}</p>
          )}
        </div>

        <div className="mt-2">
          <label
            htmlFor="tipo_pregunta"
            className="block text-[16px] font-page font-semibold text-primary"
          >
            Tipo de Pregunta
          </label>
          <TipoPregunta register={register} errors={errors} setValue={setValue}
            resetSelectRef={resetTipoPreguntaRef}    />
        </div>

        <div className="mt-2">
          <label
            htmlFor="punteo"
            className="block font-page text-[16px] font-semibold text-primary"
          >
            Punteo o Valor de la Pregunta
          </label>
          <input
            type="number"
            id="punteo"
            className="bg-[#F7FAFF] h-[38px] w-[318px] mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page"
            placeholder="1, 2, 0.5, etc."
            step="0.1"
            {...register("punteo", {
              required: "*El Punteo es requerido",
              min: { value: 0, message: "*El punteo no puede ser negativo" },
            })}
          />
          {errors.punteo && (
            <p className="text-red-900 text-sm">{errors.punteo.message}</p>
          )}
        </div>

        <div className="col-span-2 mt-4">
          <h3 className="text-[18px] font-page font-bold text-primary mb-2">
            Respuestas
          </h3>
          <div>
            {fields.map((answer, index) => (
              <div key={answer.id} className="flex items-center mb-4">
                <input
                  type="text"
                  id={`respuesta-${index}`}
                  {...register(`respuestas[${index}].respuesta`, {
                    required: "*La respuesta es requerida",
                  })}
                  className="bg-[#F7FAFF] h-[38px] w-full rounded-sm shadow-sm border border-primary pl-3 font-page mr-2"
                  placeholder="Ejemplo: Misión del EMDN, Verdadero, Falso, etc."
                />
                <label className="inline-flex items-center mr-2">
                  <input
                    type="checkbox"
                    id={`esCorrecta-${index}`}
                    {...register(`respuestas[${index}].esCorrecta`)}
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="ml-2 text-sm font-bold text-primary">
                    Correcta
                  </span>
                </label>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {fields.length < 3 && (
            <button
              type="button"
              onClick={() => append({ respuesta: "", esCorrecta: false })}
              className="mt-2 flex items-center font-bold text-primary hover:text-primary-dark"
            >
              <FaPlus size={16} className="mr-1" />
              Agregar Respuesta
            </button>
          )}
        </div>

        <div className="flex justify-center">
          {id ? (
            <div className="flex justify-end space-x-4 mb-3 ml-[730px] w-full">
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
            <div className="flex justify-center ml-[335px] w-full">
              <button
                type="submit"
                className="bg-[#142957] mt-2 font-normal font-page mb-10 text-white border-2 border-transparent rounded-[10px] text-[16px] cursor-pointer transition duration-300 ease-in-out  h-[40px] md:w-[300px]  hover:bg-white hover:text-primary hover:border-primary"
              >
                Crear Pregunta
              </button>
              {toastMessage && <div>{toastMessage}</div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
