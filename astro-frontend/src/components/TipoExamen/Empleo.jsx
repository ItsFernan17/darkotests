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

  return (
    <>
      <Select
        instanceId="empleo-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Empleo"
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: "#F7FAFF",
            height: "34px",
            width: "320px",
            marginTop: "0.25rem",
            borderRadius: "0.125rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            borderColor: "#142957",
            paddingLeft: "0.75rem",
            fontFamily: "Poppins",
          }),
        }}
      />

      {errors.ceom && (
        <p className="text-red-900 text-sm mb-0">{errors.ceom.message}</p>
      )}
    </>
  );
}

export default Empleo;
