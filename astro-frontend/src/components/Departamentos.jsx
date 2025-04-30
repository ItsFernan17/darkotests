import React, { useState, useEffect } from "react";
import { useFetch } from "../useFetch";
import Select from "react-select";

function Departamentos({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/departamento");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((departamento) => ({
    value: departamento.codigo_departamento,
    label: departamento.nombre_departamento,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("residencia", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("residencia", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("residencia", {
      required: "*Seleccione un departamento",
      validate: (value) => value !== "0" || "*Seleccione un departamento válido",
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
      backgroundColor: '#F7FAFF',
      height: '34px',
      width: '320px',
      marginTop: '0.25rem',
      borderRadius: '0.125rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderColor: '#142957',
      paddingTop: '0px',
      paddingBottom: '0px',
      fontFamily: 'Poppins',
      display: 'flex',
      alignItems: 'center',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '34px',
      padding: '0 8px',
      display: 'flex',
      alignItems: 'center',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '34px',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '150px',
      overflowY: 'auto',
    }),
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Select
        instanceId="departamento-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Departamento"
        isClearable
        styles={customStyles}
      />

      {errors.residencia && (
        <p className="text-red-900 text-sm mb-0">{errors.residencia.message}</p>
      )}
    </>
  );
}

export default Departamentos;
