import React, { useState, useEffect } from "react";
import Select from "react-select";

function Evaluado({ register, errors, setValue, resetSelectRef }) {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("accessToken");

  const fetchUsuarios = async () => {
    try {
      const token = getToken(); // Obtener el token de localStorage
      const response = await fetch("http://localhost:3000/api/v1/usuario", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const usuarios = await response.json();
      // Filtrar solo los usuarios con rol "evaluado"
      const evaluados = usuarios.filter((usuario) => usuario.rol === "evaluado");
      setData(evaluados);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const options = data?.map((usuario) => ({
    value: usuario.dpi,
    label: `${usuario.nombre_usuario}, ${usuario.dpi}`,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("evaluado", option?.value || "0", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("evaluado", "0", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);
    register("evaluado", {
      required: "*Seleccione un evaluado",
      validate: (value) => value !== "0" || "*Seleccione un evaluado válido",
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

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Select
        instanceId="evaluado-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Evaluado"
        isClearable
        styles={customStyles}
      />

      {errors.evaluado && (
        <p className="text-red-900 text-sm mb-0">{errors.evaluado.message}</p>
      )}
    </>
  );
}

export default Evaluado;
