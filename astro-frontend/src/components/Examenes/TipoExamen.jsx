import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";

function TipoExamen({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/tipo-examen");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((tipo_examen) => ({
    value: tipo_examen.codigo_tipoE,
    label: tipo_examen.description,
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
      validate: (value) => value !== "0" || "*Seleccione un tipo de examen válido",
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
        instanceId="tipo-examen-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Tipo de Examen"
        isClearable
        styles={customStyles}
      />

      {errors.tipo_examen && (
        <p className="text-red-900 text-sm mb-0">{errors.tipo_examen.message}</p>
      )}
    </>
  );
}

export default TipoExamen;
