import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";

function TipoPregunta({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/tipo-pregunta");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((tipo_pregunta) => ({
    value: tipo_pregunta.codigo_tipoP,
    label: tipo_pregunta.descripcion,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("tipo_pregunta", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("tipo_pregunta", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("tipo_pregunta", {
      required: "*Seleccione un tipo de pregunta",
      validate: (value) => value !== "0" || "*Seleccione un tipo de pregunta válido",
    });
  }, [register, setValue]);

  useEffect(() => {
    if (resetSelectRef) {
      resetSelectRef.current = resetSelect;
    }
  }, [resetSelectRef]);

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f3f1ef",
      height: "40px",
      width: "100%",
      borderRadius: "0.75rem",
      borderColor: "#d1d5db",
      boxShadow: "none",
      paddingLeft: "0.25rem",
      paddingRight: "0.25rem",
      fontSize: "0.875rem",
      fontFamily: "Karla, sans-serif",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 0.5rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "160px",
    }),
  };

  if (!isClient) return null;

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
        <p className="text-sm text-red-600 mt-1">{errors.tipo_pregunta.message}</p>
      )}
    </>
  );
}

export default TipoPregunta;
