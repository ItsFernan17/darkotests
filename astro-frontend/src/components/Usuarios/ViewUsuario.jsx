import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { NewUsuario } from "./NewUsuario";
import { desactiveUsuario } from "./Usuario.api";

export function ViewUsuarios() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // Role of the logged-in user

  function getToken() {
    return localStorage.getItem("accessToken");
  }

  useEffect(() => {
    // Get the role of the logged-in user from localStorage
    const storedUserRole = localStorage.getItem("role");
    setUserRole(storedUserRole);
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = getToken(); // Obtener el token de localStorage

      const response = await fetch("http://localhost:3000/api/v1/usuario", {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const usuarios = await response.json();
      setData(usuarios); // Actualizamos el estado de la tabla
      setLoading(false); // Desactivamos el estado de carga
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredData = data.filter(
    (item) =>
      (item.dpi && item.dpi.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.nombre_completo &&
        item.nombre_completo.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.nombre_usuario &&
        item.nombre_usuario.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleSelectedRowsChange = ({ selectedRows }) => {
    if (selectedRows.length > 0) {
      setSelectedUser(selectedRows[0]);
    } else {
      setSelectedUser(null);
    }
  };

  const handleEditClick = () => {
    if (selectedUser) {
      setModalIsOpen(true);
    }
  };

  const handleDeleteClick = async () => {
    if (selectedUser) {
      await desactiveUsuario(selectedUser.dpi);
      setDeleteModalIsOpen(false); // Cerrar modal después de eliminar
      setSelectedUser(null); // Deseleccionamos el usuario
      fetchUsuarios(); // Recargar datos después de eliminar
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false); // Cerrar modal
    setSelectedUser(null); // Deseleccionar usuario
  };

    // Exportar a Excel
    const exportToExcel = () => {
      if (filteredData.length > 0) {
        const exportData = filteredData.map(
          ({
            dpi,
            nombre_completo,
            nombre_usuario,
            telefono,
            rol,
            residencia,
            comando,
            grado,
            poblacion,
          }) => ({
            DPI: dpi,
            Nombre: nombre_completo,
            Usuario: nombre_usuario,
            Telefono: telefono,
            Rol: rol,
            Residencia: residencia?.nombre_departamento || "N/A",
            Comando: comando?.nombre_comando || "N/A",
            Grado: grado?.nombre_grado || "N/A",
            Poblacion: poblacion?.nombre_poblacion || "N/A",
          })
        );
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "usuarios.xlsx");
      } else {
        alert("No hay datos para exportar");
      }
    };
  
    // Exportar a PDF
    const exportToPDF = () => {
      if (filteredData.length > 0) {
        const exportData = filteredData.map(
          ({
            dpi,
            nombre_completo,
            nombre_usuario,
            telefono,
            rol,
            residencia,
            comando,
            grado,
            poblacion,
          }) => [
            dpi,
            nombre_completo,
            nombre_usuario,
            telefono,
            rol,
            residencia?.nombre_departamento || "N/A",
            comando?.nombre_comando || "N/A",
            grado?.nombre_grado || "N/A",
            poblacion?.nombre_poblacion || "N/A",
          ]
        );
        const doc = new jsPDF();
        doc.autoTable({
          head: [
            [
              "DPI",
              "Nombre",
              "Usuario",
              "Telefono",
              "Rol",
              "Residencia",
              "Comando Militar",
              "Grado Militar",
              "Poblacion Militar",
            ],
          ],
          body: exportData,
        });
        doc.save("usuarios.pdf");
      } else {
        alert("No hay datos para exportar");
      }
    };

  const columns = [
    {
      name: "DPI",
      selector: (row) => row.dpi || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre_completo || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Usuario",
      selector: (row) => row.nombre_usuario || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Telefono",
      selector: (row) => row.telefono || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Rol",
      selector: (row) => row.rol || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Residencia",
      selector: (row) => row.residencia.nombre_departamento || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Comando Militar",
      selector: (row) => row.comando.nombre_comando || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Grado Militar",
      selector: (row) => row.grado.nombre_grado || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Poblacion Militar",
      selector: (row) => row.poblacion.nombre_poblacion || "",
      sortable: true,
      className: "font-page",
    },
  ];

  if (loading) return <div className="text-center font-page">Cargando...</div>;

  return (
    <div className="w-full p-5">
      <div className="flex mb-4 items-center relative w-[600px]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border  bg-[#F7FAFF] p-2 pl-10 w-full rounded-md focus:outline-none focus:ring focus:border-blue-300 font-page"
            placeholder="Buscar usuario..."
          />
        </div>

        {/* Texto y botones de exportación alineados */}
        <div className="flex ml-4 items-center translate-x-[550px] space-x-3">
          {/* Texto Exportar */}
          <span className="font-page font-semibold text-[16px] text-primary">
            Exportar en:
          </span>

          {/* Botón Exportar a Excel */}
          <button
            className="bg-[#0f763d] text-white border border-[#0f763d] p-2 rounded flex justify-center items-center"
            onClick={exportToExcel}
          >
            <FaFileExcel className="size-5" />
          </button>

          {/* Botón Exportar a PDF */}
          <button
            className="bg-[#da1618] text-white p-2 rounded flex justify-center items-center"
            onClick={exportToPDF}
          >
            <FaFilePdf className="size-5" />
          </button>
        </div>
      </div>

      {/* Mostrar acciones si hay un usuario seleccionado */}
      {selectedUser && (
        <div className="flex items-center bg-primary text-white p-2 rounded-md mb-4">
          <span className="mr-4 font-page ml-7">
            Seleccionado: {selectedUser.nombre_usuario}
          </span>
          {/* Deshabilitar edición si el usuario actual es auxiliar y el seleccionado es admin */}
          <button
            onClick={handleEditClick}
            className={`flex items-center text-primary bg-[#FFFFFF] px-4 py-2 ml-[760px] rounded-[10px] mr-2 ${
              selectedUser.rol === "admin" && userRole === "auxiliar"
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={selectedUser.rol === "admin" && userRole === "auxiliar"}
          >
            <FaEdit className="size-5" />
          </button>
          {/* Deshabilitar eliminación si el usuario actual es auxiliar y el seleccionado es admin */}
          <button
            onClick={() => setDeleteModalIsOpen(true)}
            className={`flex items-center text-primary bg-[#ED8080] px-4 py-2 rounded-[10px] ${
              selectedUser.rol === "admin" && userRole === "auxiliar"
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={selectedUser.rol === "admin" && userRole === "auxiliar"}
          >
            <FaTrashAlt className="size-5" />
          </button>
        </div>
      )}

      {/* Componente de la tabla */}
      <div className="relative z-10">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={5} // Mostrará solo 5 registros por página
          paginationRowsPerPageOptions={[5]} // Opciones limitadas a solo 5 registros por página
          highlightOnHover
          noDataComponent={<div className="font-page">No hay registros</div>}
          selectableRows
          onSelectedRowsChange={handleSelectedRowsChange}
          paginationComponentOptions={{
            rowsPerPageText: "Mostrando", // Texto para el dropdown
            rangeSeparatorText: "de",
          }}
          selectableRowsSingle
          selectableRowSelected={(row) =>
            selectedUser && row.dpi === selectedUser.dpi
          }
          customStyles={{
            headCells: {
              style: {
                color: "#142957", // Texto blanco
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
              },
            },
            rows: {
              style: {
                backgroundColor: "#FFFFFF", // Fila clara
                "&:hover": {
                  backgroundColor: "#E7EBF8 !important", // Fila al hacer hover
                },
                minHeight: "48px", // Altura mínima de las filas
              },
            },
            cells: {
              style: {
                paddingLeft: "10px", // Espaciado en celdas
                paddingRight: "10px",
                fontSize: "14px",
                color: "#142957", // Gris oscuro para el texto
              },
            },
            pagination: {
              style: {
                backgroundColor: "none", // Fondo claro para la paginación (equivalente a bg-gray-100)
                padding: "10px", // Añade algo de padding
                fontSize: "14px !important",
                color: "#142957 !important",
                fontWeight: "bold",
                height: "30px",
                display: "flex",
                justifyContent: "flex-start",
                border: "none",
                boxShadow: "none",
              },
              pageButtonsStyle: {
                fontSize: "14px !important",
                fontWeight: "bold",
                border: "3px Solid #142957",
                backgroundColor: "#142957",
                borderRadius: "15px",
                padding: "5px",
                margin: "0px 2px",
                fill: "#FFFFFF !important",
              },
            },
          }}
        />
      </div>

      {/* Modal de edición */}
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[700px] rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold items-center text-[25px]">
                Actualizar Usuario
              </h2>
              <img
                src="/EMDN1.png" // Optional: Replace this with your actual logo path
                alt="Logo"
                className="h-14"
              />
            </div>

            {/* Modal Body */}
            <div className="px-6">
              <NewUsuario
                usuario={selectedUser.dpi}
                onClose={handleCloseModal}
                onUserSaved={fetchUsuarios}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {deleteModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] rounded-lg shadow-lg">
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold items-center text-[25px]">
                Confirmación de Eliminación
              </h2>
              <img
                src="/EMDN1.png" // Optional: Replace this with your actual logo path
                alt="Logo"
                className="h-14"
              />
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-lg mb-4">
                ¿Estás seguro de eliminar este registro?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDeleteClick}
                  className="bg-[#ED8080]  text-[#090000] px-4 py-2 rounded-md shadow transition duration-300 ease-in-out border hover:bg-white hover:text-[#090000] hover:border-[#ED8080]"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => {
                    setDeleteModalIsOpen(false);
                    setSelectedUser(null);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-md shadow transition duration-300 ease-in-out border hover:bg-white hover:text-primary hover:border-primary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
