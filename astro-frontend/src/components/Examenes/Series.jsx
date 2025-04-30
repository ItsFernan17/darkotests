import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";

function Serie({ register, errors, setValue, seriesIndex, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/serie");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((serie) => ({
    value: serie.codigo_serie,
    label: `${serie.nombre} - ${serie.instrucciones}`,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue(`series[${seriesIndex}].serie`, option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue(`series[${seriesIndex}].serie`, "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register(`series[${seriesIndex}].serie`, {
      required: "*Seleccione una serie de examen",
      validate: (value) => value !== "0" || "*Seleccione una serie válida",
    });
  }, [register, setValue, seriesIndex]);

  useEffect(() => {
    if (resetSelectRef) {
      resetSelectRef.current = resetSelect;
    }
  }, [resetSelectRef]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#F7FAFF",
      height: "34px",
      width: "100%",
      marginTop: "0.25rem",
      borderRadius: "0.125rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      borderColor: "#142957",
      paddingTop: "0px",
      paddingBottom: "0px",
      fontFamily: "Poppins",
      display: "flex",
      alignItems: "center",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "34px",
      padding: "0 8px",
      display: "flex",
      alignItems: "center",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "34px",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

  if (!isClient) {
    return null;
  }

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
        <p className="text-red-900 text-sm mb-0">
          {errors.series[seriesIndex].serie.message}
        </p>
      )}
    </>
  );
}

export default Serie;
