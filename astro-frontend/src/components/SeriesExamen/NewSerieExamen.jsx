import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAsignacionExamen, updateAsignacionExamen } from "./Series.api";
import { FileText, Info } from "lucide-react";

export function NewSerie({ codigo_serie = null, onClose = null, onUserSaved = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const inputClass =
  "bg-[#f3f1ef] border border-gray-300 text-sm rounded-xl focus:ring-primary focus:border-primary block w-full px-10 py-2.5";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const iconClass =
  "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400";
  
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

  const InputWithIcon = React.forwardRef(({ icon: Icon, id, placeholder, ...props }, ref) => (
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


  return (
    <div>
      <ToastContainer />
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="serie" className={labelClass}>Serie</label>
          <InputWithIcon
            icon={FileText}
            id="serie"
            placeholder="Ejemplo: Serie II"
            {...register("serie", {
              required: "*La serie es requerida",
              minLength: { value: 3, message: "*Debe tener al menos 3 caracteres" },
              pattern: { value: /^[A-Za-z0-9\s]+$/, message: "*Solo letras, números y espacios" },
            })}
          />
          {errors.serie && <p className="text-sm text-red-600 mt-1">{errors.serie.message}</p>}
        </div>

        <div>
          <label htmlFor="instrucciones" className={labelClass}>Instrucciones</label>
          <InputWithIcon
            icon={Info}
            id="instrucciones"
            placeholder="Instrucciones para esta serie"
            {...register("instrucciones", {
              required: "*Instrucciones requeridas",
              minLength: { value: 10, message: "*Mínimo 10 caracteres" },
            })}
          />
          {errors.instrucciones && <p className="text-sm text-red-600 mt-1">{errors.instrucciones.message}</p>}
        </div>

        <div className="col-span-full flex justify-center mt-2 mb-6">
          <button
            type="submit"
            className="bg-[#1a1a1a] text-white py-3 w-[200px] rounded-full font-semibold hover:bg-[#333] transition"
          >
            {codigo_serie ? "Actualizar Serie" : "Crear Serie"}
          </button>
        </div>
      </form>
    </div>
  );
}
