import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { backendHost } from "../../utils/apiHost";

function Pregunta({ register, errors, setValue, getValues, name }) {
  const { data, loading, error } = useFetch(`http://${backendHost}:3000/api/v1/pregunta`);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreguntas, setSelectedPreguntas] = useState([]);

  useEffect(() => {
    register(name, {
      required: "*Seleccione al menos una pregunta",
      validate: (value) => value?.length > 0 || "*Debe seleccionar mínimo una pregunta",
    });
  }, [register, name]);

  useEffect(() => {
    // Actualiza el valor del formulario cuando cambia la selección
    setValue(name, selectedPreguntas.map((p) => p.codigo_pregunta));
  }, [selectedPreguntas, setValue, name]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (e, pregunta) => {
    const isChecked = e.target.checked;
    const currentValues = getValues(name) || [];

    if (isChecked) {
      const updated = [...selectedPreguntas, pregunta];
      setSelectedPreguntas(updated);
      setValue(name, updated.map((p) => p.codigo_pregunta), { shouldValidate: true });
    } else {
      const updated = selectedPreguntas.filter(
        (item) => item.codigo_pregunta !== pregunta.codigo_pregunta
      );
      setSelectedPreguntas(updated);
      setValue(name, updated.map((p) => p.codigo_pregunta), { shouldValidate: true });
    }
  };

  const isPreguntaSelected = (pregunta) =>
    selectedPreguntas.some((p) => p.codigo_pregunta === pregunta.codigo_pregunta);

  if (loading) return <p className="text-sm text-gray-600">Cargando preguntas...</p>;
  if (error) return <p className="text-sm text-red-600">Error al cargar preguntas.</p>;

  return (
    <div className="relative w-full font-page">
      <label className="block text-[16px] font-semibold text-primary mb-2">
        Seleccione una o varias Preguntas
      </label>

      <div
        className="bg-[#F3F1EF] h-[40px] w-full rounded-md border border-gray-300 pl-3 pr-3 flex items-center justify-between cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="text-gray-700">
          {selectedPreguntas.length > 0
            ? `${selectedPreguntas.length} seleccionada(s)`
            : "Preguntas disponibles"}
        </span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isOpen && (
        <div className="absolute bg-white border border-primary w-full mt-1 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {data?.map((pregunta) => (
            <div
              key={pregunta.codigo_pregunta}
              className="flex items-center p-2 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                id={`pregunta-${pregunta.codigo_pregunta}`}
                checked={isPreguntaSelected(pregunta)}
                onChange={(e) => handleCheckboxChange(e, pregunta)}
                className="form-checkbox h-5 w-5 text-primary mr-2"
              />
              <label
                htmlFor={`pregunta-${pregunta.codigo_pregunta}`}
                className="text-sm"
              >
                {pregunta.descripcion}
              </label>
            </div>
          ))}
        </div>
      )}

      {selectedPreguntas.length > 0 && (
        <div className="mt-4">
          <label className="block text-[15px] font-medium text-primary mb-2">
            Preguntas Seleccionadas
          </label>
          {selectedPreguntas.map((pregunta) => (
            <input
              key={pregunta.codigo_pregunta}
              type="text"
              value={pregunta.descripcion}
              readOnly
              className="bg-[#f3f1ef] h-[38px] w-full mb-2 rounded-md border border-gray-300 pl-3 text-sm"
            />
          ))}
        </div>
      )}

      {errors?.[name] && (
        <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}

export default Pregunta;
