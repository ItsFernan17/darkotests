import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";

function TipoPregunta({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/tipo-pregunta");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Crear las opciones para el select con los datos del tipo de pregunta
  const options = data?.map((tipo_pregunta) => ({
    value: tipo_pregunta.codigo_tipoP,
    label: tipo_pregunta.descripcion,
  }));

  // Manejar el cambio en la selección
  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("tipo_pregunta", option?.value || "0", { shouldValidate: true });
  };

  // Función para reiniciar el select
  const resetSelect = () => {
    setSelectedOption(null);
    setValue("tipo_pregunta", "0", { shouldValidate: false });
  };

  // Registrar el campo tipo_pregunta en react-hook-form
  useEffect(() => {
    setIsClient(true);
    register("tipo_pregunta", {
      required: "*Seleccione un Tipo de Pregunta",
      validate: (value) => value !== "0" || "*Seleccione un tipo de pregunta válido",
    });
  }, [register, setValue]);

  // Poner la función resetSelect en el ref pasado desde el padre
  useEffect(() => {
    if (resetSelectRef) {
      resetSelectRef.current = resetSelect;
    }
  }, [resetSelectRef]);

  // Estilos personalizados para el select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#F7FAFF',
      height: '34px',
      width: '320px',
      marginTop: '0.25rem',
      borderRadius: '0.125rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderColor: '#142957',
      display: 'flex',
      alignItems: 'center',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '100%',
      padding: '0 8px',
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '150px',
      overflowY: 'auto',
    }),
    option: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Select
        instanceId="tipo-pregunta-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Tipo de Pregunta"
        isClearable
        styles={customStyles}
      />

      {errors.tipo_pregunta && (
        <p className="text-red-900 text-sm mb-0">{errors.tipo_pregunta.message}</p>
      )}
    </>
  );
}

export default TipoPregunta;
