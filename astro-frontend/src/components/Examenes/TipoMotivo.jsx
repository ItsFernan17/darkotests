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
    control: (provided) => ({
      ...provided,
      backgroundColor: "#F7FAFF",
      height: "34px",
      width: "320px",
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
        instanceId="motivo-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione Motivo del Examen"
        isClearable
        styles={customStyles}
      />

      {errors.motivo && (
        <p className="text-red-900 text-sm mb-0">{errors.motivo.message}</p>
      )}
    </>
  );
}

export default TipoMotivo;
