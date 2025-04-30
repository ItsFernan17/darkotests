import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Pregunta({ register, errors, setValue, getValues, name }) {
  const { data, loading, error } = useFetch("http://localhost:3000/api/v1/pregunta");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreguntas, setSelectedPreguntas] = useState([]);

  useEffect(() => {
    // Asegurarnos de actualizar el valor de las preguntas en el formulario cuando cambien las preguntas seleccionadas.
    setValue(name, selectedPreguntas.map((p) => p.codigo_pregunta));
  }, [selectedPreguntas, setValue, name]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (e, pregunta) => {
    const isChecked = e.target.checked;
    const currentValues = getValues(name) || [];

    if (isChecked) {
      setSelectedPreguntas([...selectedPreguntas, pregunta]);
      setValue(name, [...currentValues, pregunta.codigo_pregunta]);
    } else {
      const filteredPreguntas = selectedPreguntas.filter(
        (item) => item.codigo_pregunta !== pregunta.codigo_pregunta
      );
      setSelectedPreguntas(filteredPreguntas);
      setValue(
        name,
        currentValues.filter((value) => value !== pregunta.codigo_pregunta)
      );
    }
  };

  const isPreguntaSelected = (pregunta) =>
    selectedPreguntas.some((selected) => selected.codigo_pregunta === pregunta.codigo_pregunta);

  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>Error al cargar preguntas.</p>;

  return (
    <div className="relative w-full">
      <p className="text-[16px] font-page font-semibold text-primary mt-3 mb-3">
        Seleccione una o varias Preguntas
      </p>

      <div
        className="bg-[#F7FAFF] h-[38px] w-full mt-1 rounded-sm shadow-sm border border-primary pl-3 pr-3 flex items-center justify-between cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="font-page text-gray-700">Preguntas</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isOpen && (
        <div className="absolute bg-white border border-primary w-full mt-2 rounded-sm shadow-lg z-10 max-h-48 overflow-y-auto">
          {data?.map((pregunta) => (
            <div
              key={pregunta.codigo_pregunta}
              className="flex items-center p-2 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                id={`pregunta-${pregunta.codigo_pregunta}`}
                value={pregunta.codigo_pregunta}
                checked={isPreguntaSelected(pregunta)}
                onChange={(e) => handleCheckboxChange(e, pregunta)}
                className="form-checkbox h-5 w-5 text-primary mr-2"
              />
              <label
                htmlFor={`pregunta-${pregunta.codigo_pregunta}`}
                className="text-sm font-page"
              >
                {pregunta.descripcion}
              </label>
            </div>
          ))}
        </div>
      )}

      {selectedPreguntas.length > 0 && (
        <div>
          <label className="block text-[18px] font-page font-bold mt-6 mb-2 text-primary">
            Preguntas Seleccionadas
          </label>
          {selectedPreguntas.map((pregunta, index) => (
            <input
              key={index}
              type="text"
              value={pregunta.descripcion}
              readOnly
              className="bg-[#F7FAFF] h-[38px] w-full mt-1 rounded-sm shadow-sm border border-primary pl-3 font-page mb-2"
            />
          ))}
        </div>
      )}

      {errors.preguntas && (
        <p className="text-red-900 text-sm mb-0">{errors.preguntas.message}</p>
      )}
    </div>
  );
}

export default Pregunta;
