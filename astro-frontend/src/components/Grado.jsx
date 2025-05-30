import React, { useState, useEffect } from "react";
import { useFetch } from "../useFetch";
import Select from "react-select";
import { backendHost } from "../utils/apiHost";

function Grado({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch(`http://${backendHost}:3000/api/v1/grado`);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((grado) => ({
    value: grado.codigo_grado,
    label: grado.nombre_grado,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("grado", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("grado", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("grado", {
      required: "*Seleccione un grado",
      validate: (value) => value !== "0" || "*Seleccione un grado válido",
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
        instanceId="grado-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Grado"
        isClearable
        styles={customStyles}
      />

      {errors.grado && (
        <p className="text-red-900 text-sm mb-0">{errors.grado.message}</p>
      )}
    </>
  );
}

export default Grado;
