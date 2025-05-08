import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";

function TipoMotivo({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/motivo");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const filteredData = data?.filter(
    (motivo) => motivo.codigo_motivo >= 100 && motivo.codigo_motivo < 200
  );

  const options = filteredData?.map((motivo) => ({
    value: motivo.codigo_motivo,
    label: motivo.nombre_motivo,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("motivo", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("motivo", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("motivo", {
      required: "*Seleccione un motivo del examen",
      validate: (value) => value !== "0" || "*Seleccione un motivo válido",
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
        instanceId="motivo-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione Motivo del Examen"
        isClearable
        styles={customStyles}
      />
      {errors.motivo && (
        <p className="text-sm text-red-600 mt-1">{errors.motivo.message}</p>
      )}
    </>
  );
}

export default TipoMotivo;
