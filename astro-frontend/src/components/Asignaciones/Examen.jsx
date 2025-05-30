import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";
import { backendHost } from "../../utils/apiHost"; 

function Examenes({ register, errors, setValue, resetSelectRef, examenesFiltrados = [] })  {
  const { data } = useFetch(`http://${backendHost}:3000/api/v1/examen`);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [examenData, setExamenData] = useState(null);

  const options = data?.map((examen) => ({
    value: examen.codigo_examen,
    label: `${examen.motivo_examen?.nombre_motivo || "Motivo N/D"} - ${examen.tipo_examen?.description || "Tipo N/D"}`,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    const selected = data.find((ex) => ex.codigo_examen === option?.value);
    setValue("examen", option?.value || "0", { shouldValidate: true });
    setExamenData(selected);
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setExamenData(null);
    setValue("examen", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("examen", {
      required: "*Seleccione un examen",
      validate: (value) => value !== "0" || "*Seleccione un examen válido",
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
        instanceId="examen-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Examen"
        isClearable
        styles={customStyles}
      />

      {errors.examen && (
        <p className="text-sm text-red-600 mt-1">{errors.examen.message}</p>
      )}
    </>
  );
}

export default Examenes;
