import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FileText, CheckCircle, Edit3 } from "lucide-react";
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

const InputWithIcon = React.forwardRef(
  ({ icon: Icon, id, placeholder, type = "text", className = "", ...props }, ref) => (
    <div className={`relative w-full`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Icon size={16} />
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`bg-[#f3f1ef] border border-gray-300 text-sm rounded-xl focus:ring-primary focus:border-primary block w-full px-10 py-2.5 ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  )
);


  return (
    <div>
      <ToastContainer />
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="mt-4 col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Pregunta</label>
          <InputWithIcon
            icon={Edit3}
            id="pregunta"
            placeholder="Ejemplo: ¿Cuál es la misión del EMDN?"
            {...register("pregunta", { required: "*La Pregunta es requerida" })}
          />
          {errors.pregunta && <p className="text-sm text-red-600 mt-1">{errors.pregunta.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Pregunta</label>
          <TipoPregunta
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetTipoPreguntaRef}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Punteo</label>
          <InputWithIcon
            icon={FileText}
            id="punteo"
            type="number"
            placeholder="Ej. 1, 2, 0.5"
            step="0.1"
            {...register("punteo", {
              required: "*El punteo es requerido",
              min: { value: 0, message: "*No puede ser negativo" },
            })}
          />
          {errors.punteo && <p className="text-sm text-red-600 mt-1">{errors.punteo.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Respuestas</label>
          {fields.map((item, index) => (
           <div key={item.id} className="flex items-center mb-3 w-full space-x-2 ">
              <InputWithIcon
                icon={CheckCircle}
                placeholder="Texto de la respuesta"
                {...register(`respuestas.${index}.respuesta`, {
                  required: "*Respuesta requerida",
                })}
              />
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register(`respuestas.${index}.esCorrecta`)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-1 text-sm text-green-800 font-semibold">Correcta</span>
              </label>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="text-red-500">
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          {fields.length < 3 && (
            <button
              type="button"
              onClick={() => append({ respuesta: "", esCorrecta: false })}
              className="mt-1 flex items-center text-[#5673E0] font-medium hover:text-blue-900"
            >
              <FaPlus className="mr-1" /> Agregar Respuesta
            </button>
          )}
        </div>

        <div className="md:col-span-2 flex justify-center mt-2 mb-6">
          <button
            type="submit"
            className={`bg-[#1a1a1a] text-white py-3 w-[220px] rounded-full font-semibold hover:bg-[#333] transition mt-2`}
          >
            {id ? "Actualizar Pregunta" : "Crear Pregunta"}
          </button>
        </div>
      </form>
    </div>
  );
}
