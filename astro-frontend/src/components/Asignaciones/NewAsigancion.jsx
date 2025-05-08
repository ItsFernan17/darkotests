import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAsignacion, updateAsignacion } from "./Asignaciones.api";
import Examen from "./Examen";
import { Search } from "lucide-react";

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
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    const fetchExamenData = async () => {
      if (codigoExamen) {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(
            `http://localhost:3000/api/v1/examen/${codigoExamen}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
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
    const fetchAsignaciones = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:3000/api/v1/asignacion", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAsignaciones(data);
      } catch (error) {
        toast.error("Error al cargar asignaciones.");
      }
    };

    fetchAsignaciones();
  }, []);

  const handleErrors = (error) => {
    const mensaje = error?.message || "";

    if (mensaje.includes("Failed to fetch")) {
      toast.error("Error al conectar con el servidor. Verifica tu conexión.", {
        autoClose: 3000,
      });
    } else if (mensaje.includes("Esta asignación ya tiene asignado ese examen.")) {
      toast.error("El evaluado ya tiene asignado este examen.", {
        autoClose: 3000,
      });
    } else if (
      mensaje.includes(
        "Los evaluados ya poseen una asignación para este examen."
      )
    ) {
      toast.error("Uno o más evaluados ya tienen asignado este examen.", {
        autoClose: 3000,
      });
    } else if (mensaje.includes("422")) {
      toast.error(
        "Error: Datos inválidos. Revisa los campos y vuelve a intentarlo.",
        {
          autoClose: 3000,
        }
      );
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
          evaluado: selectedEvaluados[0],
          evaluacion: parseInt(formData.examen),
          usuario_modifica: localStorage.dpi,
        });

        toast.success("Asignación actualizada exitosamente!", {
          autoClose: 1500,
        });

        setTimeout(() => {
          onUserSaved();
          onClose();
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
          evaluados: selectedEvaluados,
          examen: parseInt(formData.examen),
          usuario_ingreso: localStorage.dpi,
        });

        toast.success("Asignación creada exitosamente!", {
          autoClose: 1500,
        });

        reset();
        resetExamenRef.current();
        setSelectedEvaluados([]);
      } catch (error) {
        console.error("Error al crear la asignación:", error);
        handleErrors(error);
      }
    }
  });

  const [evaluadoList, setEvaluadoList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvaluados, setSelectedEvaluados] = useState([]);

  const InputWithIcon = React.forwardRef(
    (
      { icon: Icon, id, placeholder, type = "text", className = "", ...props },
      ref
    ) => (
      <div className="relative w-full">
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

  const filteredEvaluados = evaluadoList.filter(
    (evalItem) =>
      evalItem.nombre_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || evalItem.dpi.includes(searchTerm)
  );

  const handleCheckboxChange = (dpi) => {
    if (codigo_asignacion) {
      setSelectedEvaluados([dpi]);
    } else {
      setSelectedEvaluados((prev) =>
        prev.includes(dpi) ? prev.filter((d) => d !== dpi) : [...prev, dpi]
      );
    }
  };

  const fetchEvaluados = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:3000/api/v1/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const evaluados = data.filter((user) => user.rol === "evaluado");

      if (codigo_asignacion) {
        const asignacionRes = await fetch(
          `http://localhost:3000/api/v1/asignacion/${codigo_asignacion}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const asignacionData = await asignacionRes.json();

        // Encuentra el evaluado directamente en la lista para mostrarlo
        setEvaluadoList(
          evaluados.filter((e) => e.dpi === asignacionData.evaluado.dpi)
        );
        setSelectedEvaluados([asignacionData.evaluado.dpi]);
        setValue("examen", asignacionData.examen.codigo_examen);
      } else {
        setEvaluadoList(evaluados);
      }
    } catch (error) {
      toast.error("Error al cargar evaluados.");
    }
  };

  useEffect(() => {
    fetchEvaluados();
  }, []);

  return (
    <div className="p-4">
      <ToastContainer />
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        <div className="col-span-full">
          <label className="block text-[16px] font-page font-semibold text-primary mb-1">
            Examen
          </label>
          <Examen
            register={register}
            errors={errors}
            setValue={setValue}
            resetSelectRef={resetExamenRef}
            modoEdicion={true}
          />
        </div>

        <div className="col-span-full">
          <label className="block text-[16px] font-page font-semibold text-primary mb-2">
            Evaluados
          </label>

          {!codigo_asignacion && (
            <InputWithIcon
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por DPI o nombre..."
              className="mb-3"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-[#d1d5db] p-3 rounded-md bg-[#f3f1ef]">
            {filteredEvaluados.map((evaluado) => (
              <label
                key={evaluado.dpi}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type={codigo_asignacion ? "radio" : "checkbox"}
                  name="evaluado"
                  value={evaluado.dpi}
                  checked={
                    codigo_asignacion
                      ? selectedEvaluados[0] === evaluado.dpi
                      : selectedEvaluados.includes(evaluado.dpi)
                  }
                  onChange={() => handleCheckboxChange(evaluado.dpi)}
                  disabled={
                    codigo_asignacion && selectedEvaluados[0] !== evaluado.dpi
                  }
                />
                {evaluado.nombre_completo} - {evaluado.dpi}
              </label>
            ))}
          </div>

          {errors.evaluados && selectedEvaluados.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Debes seleccionar al menos un evaluado.
            </p>
          )}
        </div>

        <div className="col-span-full flex justify-center mt-6 mb-6">
          <button
            type="submit"
            className="bg-[#1a1a1a] text-white py-3 w-[200px] rounded-full font-semibold hover:bg-[#333] transition mt-2"
          >
            {codigo_asignacion
              ? "Actualizar Asignación"
              : "Realizar Asignación"}
          </button>
        </div>
      </form>
    </div>
  );
}
