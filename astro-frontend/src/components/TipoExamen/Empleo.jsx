import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";

function Empleo({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/empleo");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((empleo) => ({
    value: empleo.ceom,
    label: `${empleo.ceom} - ${empleo.descripcion}`,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("ceom", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("ceom", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("ceom", {
      required: "*Seleccione un empleo",
      validate: (value) => value !== "0" || "*Seleccione un empleo válido",
    });
  }, [register, setValue]);

  useEffect(() => {
    resetSelectRef.current = resetSelect;
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
        instanceId="empleo-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Empleo"
        isClearable
        styles={customStyles}
      />
      {errors.ceom && (
        <p className="text-sm text-red-600 mt-1">{errors.ceom.message}</p>
      )}
    </>
  );
}

export default Empleo;
