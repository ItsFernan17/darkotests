import React, { useState, useEffect, useImperativeHandle } from "react";
import Select from "react-select";

function Roles({ register, errors, setValue, resetSelectRef }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const optionsAdmin = [
    { value: "admin", label: "Administrador" },
    { value: "auxiliar", label: "Auxiliar" },
    { value: "evaluador", label: "Evaluador" },
    { value: "evaluado", label: "Evaluado" },
  ];

  const optionsAuxiliar = [
    { value: "auxiliar", label: "Auxiliar" },
    { value: "evaluador", label: "Evaluador" },
    { value: "evaluado", label: "Evaluado" },
  ];

  const options = userRole === "admin" ? optionsAdmin : optionsAuxiliar;

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setValue("role", option?.value || "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // ✅ Registro del campo role
  useEffect(() => {
    const storedUserRole = localStorage.getItem("role");
    setUserRole(storedUserRole);

    register("role", {
      required: "*Seleccione un rol",
      validate: (value) => value !== "" || "*Seleccione un rol válido",
    });
  }, [register]);

  // ✅ Forzar limpieza vía ref
  useEffect(() => {
    if (resetSelectRef && typeof resetSelectRef === "object") {
      resetSelectRef.current = () => {
        setSelectedOption(null); // Limpia visual
        setValue("role", "", { shouldValidate: false }); // Limpia del form
      };
    }
  }, [resetSelectRef, setValue]);

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f3f1ef",
      height: "40px",
      width: "100%",
      borderRadius: "0.75rem",
      borderColor: "#d1d5db",
      boxShadow: "none",
      paddingLeft: "0.25rem",
      paddingRight: "0.25rem",
      fontSize: "0.875rem",
      fontFamily: "Karla, sans-serif",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 0.5rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "160px",
    }),
  };

  return (
    <>
      <Select
        instanceId="role-select"
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        placeholder="Seleccione un Rol"
        isClearable
        styles={customStyles}
      />
      {errors.role && (
        <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
      )}
    </>
  );
}

export default Roles;
