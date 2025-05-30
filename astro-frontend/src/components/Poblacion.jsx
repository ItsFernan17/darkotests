import React, { useState, useEffect } from "react";
import { useFetch } from "../useFetch";
import Select from "react-select";
import { backendHost } from "../utils/apiHost"; 

function Poblacion({ register, errors, setValue, resetSelectRef }) {
  const { data } = useFetch(`http://${backendHost}:3000/api/v1/poblacion`);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Crear las opciones para el select con los datos de la población
  const options = data?.map((poblacion) => ({
    value: poblacion.codigo_poblacion,
    label: poblacion.nombre_poblacion,
  }));

  // Manejar el cambio en la selección
  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("poblacion", option?.value || "0", { shouldValidate: true });
  };

  // Función para reiniciar el select
  const resetSelect = () => {
    setSelectedOption(null); // Reiniciar el valor seleccionado
    setValue("poblacion", "0", { shouldValidate: false }); // Reiniciar el valor en react-hook-form
  };

  // Registrar el campo en react-hook-form y asignar resetSelect al ref
  useEffect(() => {
    setIsClient(true);
    register("poblacion", {
      required: "*Seleccione una población",
      validate: (value) => value !== "0" || "*Seleccione una población válida",
    });

    if (resetSelectRef) {
      resetSelectRef.current = resetSelect;
    }
  }, [register, setValue, resetSelectRef]);
  
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
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '34px',
      padding: '0 8px',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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
        instanceId="poblacion-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione una Población"
        isClearable
        styles={customStyles}
      />

      {errors.poblacion && (
        <p className="text-red-900 text-sm mb-0">{errors.poblacion.message}</p>
      )}
    </>
  );
}

export default Poblacion;
