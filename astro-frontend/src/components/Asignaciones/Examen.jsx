import React, { useState, useEffect } from "react";
import { useFetch } from "../../useFetch";
import Select from "react-select";

function Examenes({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch("http://localhost:3000/api/v1/examen");
  const [selectedOption, setSelectedOption] = useState(null);
  const [examenData, setExamenData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const options = data?.map((examen) => ({
    value: examen.codigo_examen,
    label: `${examen.motivo_examen?.nombre_motivo}, ${examen.tipo_examen?.description}`,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("examen", option?.value || "0", { shouldValidate: true });
    const selectedExamen = data.find(examen => examen.codigo_examen === option?.value);
    setExamenData(selectedExamen);
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("examen", "0", { shouldValidate: false });
    setExamenData(null);
  };

  useEffect(() => {
    setIsClient(true);
    register("examen", {
      required: "*Seleccione un examen",
      validate: (value) => value !== "0" || "*Seleccione un examen válido",
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
        instanceId="examen-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Examen"
        isClearable
        styles={customStyles}
      />

      {errors.examen && (
        <p className="text-red-900 text-sm mb-0">{errors.examen.message}</p>
      )}
    </>
  );
}

export default Examenes;
