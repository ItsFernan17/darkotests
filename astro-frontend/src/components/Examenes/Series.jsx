import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";
import { backendHost } from "../../utils/apiHost"; 

function Serie({ register, errors, setValue, seriesIndex, resetSelectRef }) {
  const { data } = useFetch(`http://${backendHost}:3000/api/v1/serie`);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((serie) => ({
    value: serie.codigo_serie,
    label: `${serie.nombre} - ${serie.instrucciones}`,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue(`series[${seriesIndex}].serie`, option?.value || "0", {
      shouldValidate: true,
    });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue(`series[${seriesIndex}].serie`, "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register(`series[${seriesIndex}].serie`, {
      required: "*Seleccione una serie de examen",
      validate: (value) =>
        value !== "0" || "*Seleccione una serie válida",
    });
  }, [register, setValue, seriesIndex]);

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
        instanceId={`serie-select-${seriesIndex}`}
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione una Serie de Examen"
        isClearable
        styles={customStyles}
      />
      {errors?.series?.[seriesIndex]?.serie && (
        <p className="text-sm text-red-600 mt-1">
          {errors.series[seriesIndex].serie.message}
        </p>
      )}
    </>
  );
}

export default Serie;
