import React, { useState, useEffect } from "react";
import { useFetch } from "../useFetch";
import Select from "react-select";
import { backendHost } from "../utils/apiHost"; 

function Comando({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch(`http://${backendHost}:3000/api/v1/comando`);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((comando) => ({
    value: comando.codigo_comando,
    label: comando.nombre_comando,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("comando", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("comando", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("comando", {
      required: "*Seleccione un comando",
      validate: (value) => value !== "0" || "*Seleccione un comando válido",
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '100%',
      padding: '0 8px',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    singleValue: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '150px',
      overflowY: 'auto',
    }),
    option: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Select
        instanceId="comando-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Comando"
        isClearable
        styles={customStyles}
      />

      {errors.comando && (
        <p className="text-red-900 text-sm mb-0">{errors.comando.message}</p>
      )}
    </>
  );
}

export default Comando;
