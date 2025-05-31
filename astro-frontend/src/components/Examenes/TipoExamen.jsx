import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";
import { backendHost } from "../../utils/apiHost"; 

function TipoExamen({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch(`${backendHost}/api/v1/tipo-examen`);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((tipoExamen) => ({
    value: tipoExamen.codigo_tipoE,
    label: tipoExamen.description,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("tipo_examen", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("tipo_examen", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("tipo_examen", {
      required: "*Seleccione un tipo de examen",
      validate: (value) =>
        value !== "0" || "*Seleccione un tipo de examen válido",
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
        instanceId="tipo-examen-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Tipo de Examen"
        isClearable
        styles={customStyles}
      />
      {errors.tipo_examen && (
        <p className="text-sm text-red-600 mt-1">{errors.tipo_examen.message}</p>
      )}
    </>
  );
}

export default TipoExamen;
