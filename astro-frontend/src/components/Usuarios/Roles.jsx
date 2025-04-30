import React, { useState, useEffect } from "react";
import Select from "react-select";

function Roles({ register, errors, setValue, resetSelectRef }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState(null); // Almacenar el rol del usuario

  // Opciones para "Administrador"
  const optionsAdmin = [
    { value: "admin", label: "Administrador" },
    { value: "auxiliar", label: "Auxiliar" },
    { value: "evaluador", label: "Evaluador" },
    { value: "evaluado", label: "Evaluado" },
  ];

  // Opciones para "Auxiliar"
  const optionsAuxiliar = [
    { value: "auxiliar", label: "Auxiliar" },
    { value: "evaluador", label: "Evaluador" },
    { value: "evaluado", label: "Evaluado" },
  ];

  // Definir las opciones que se mostrarán según el rol
  const options = userRole === "admin" ? optionsAdmin : optionsAuxiliar;

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("role", option?.value || "", { shouldValidate: true });
  };

  const resetSelect = () => {
    setSelectedOption(null);
    setValue("role", "", { shouldValidate: false });
  };

  useEffect(() => {
    setIsClient(true);

    // Obtener el rol del usuario desde localStorage (o alguna fuente de autenticación)
    const storedUserRole = localStorage.getItem("role");
    setUserRole(storedUserRole);

    register("role", {
      required: "*Seleccione un rol",
      validate: (value) => value !== "" || "*Seleccione un rol válido",
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
        instanceId="role-select"
        value={selectedOption}
        options={options} // Mostrar opciones basadas en el rol
        onChange={handleSelectChange}
        placeholder="Seleccione un Rol"
        isClearable
        styles={customStyles}
      />

      {errors.role && (
        <p className="text-red-900 text-sm mb-0">{errors.role.message}</p>
      )}
    </>
  );
}

export default Roles;
