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
import { X } from "lucide-react";
import { motion } from "framer-motion";

export function ViewUsuarios() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  function getToken() {
    return localStorage.getItem("accessToken");
  }

  useEffect(() => {
    const storedUserRole = localStorage.getItem("role");
    setUserRole(storedUserRole);
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:3000/api/v1/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const usuarios = await response.json();
      setData(usuarios);
      setLoading(false);
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
        item.nombre_completo
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item.nombre_usuario &&
        item.nombre_usuario.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedUser(selectedRows.length > 0 ? selectedRows[0] : null);
  };

  const handleEditClick = () => {
    if (selectedUser) setModalIsOpen(true);
  };

  const handleDeleteClick = async () => {
    if (selectedUser) {
      await desactiveUsuario(selectedUser.dpi);
      setDeleteModalIsOpen(false);
      setSelectedUser(null);
      fetchUsuarios();
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

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
        }) => ({
          DPI: dpi,
          Nombre: nombre_completo,
          Usuario: nombre_usuario,
          Telefono: telefono,
          Rol: rol,
          Residencia: residencia?.nombre_departamento || "N/A",
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
        }) => [
          dpi,
          nombre_completo,
          nombre_usuario,
          telefono,
          rol,
          residencia?.nombre_departamento || "N/A",
        ]
      );
      const doc = new jsPDF();
      doc.autoTable({
        head: [["DPI", "Nombre", "Usuario", "Telefono", "Rol", "Residencia"]],
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
            className="border  bg-white p-2 pl-10 w-full rounded-2xl focus:outline-none focus:ring focus:border-blue-300 font-page"
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
        <div className="flex items-center h-14 justify-between bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6">
          <div className="text-gray-800 text-base font-medium">
            <span className="ml-2">
              👤 <strong>Seleccionado:</strong> {selectedUser.nombre_completo}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors
        ${
          selectedUser.rol === "admin" && userRole === "auxiliar"
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
              disabled={selectedUser.rol === "admin" && userRole === "auxiliar"}
            >
              <FaEdit className="size-4" />
              Editar
            </button>

            <button
              onClick={() => setDeleteModalIsOpen(true)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors
        ${
          selectedUser.rol === "admin" && userRole === "auxiliar"
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
              disabled={selectedUser.rol === "admin" && userRole === "auxiliar"}
            >
              <FaTrashAlt className="size-4" />
              Eliminar
            </button>
          </div>
        </div>
      )}

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
                  backgroundColor: "#ebdeef !important", // Fila al hacer hover
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
                border: "3px Solid #4f6bed",
                backgroundColor: "#4f6bed",
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-full max-w-xl rounded-2xl shadow-lg"
          >
            {/* Encabezado con imagen */}
            <div
              className="relative h-32 flex items-end px-6 py-4 rounded-t-2xl overflow-hidden animate-zoomOut"
              style={{
                backgroundImage: "url('/mod.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex justify-between items-center w-full">
                <h2 className="text-white text-3xl font-semibold flex items-center gap-2">
                  Actualizar Registro
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 z-10 text-white hover:text-red-300 transition duration-150"
                aria-label="Cerrar modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 bg-white">
              <NewUsuario
                usuario={selectedUser.dpi}
                onClose={handleCloseModal}
                onUserSaved={fetchUsuarios}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de eliminación */}
      {deleteModalIsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Encabezado con imagen y superposición */}
            <div
              className="relative h-28 flex items-end px-6 py-4 rounded-t-2xl overflow-hidden"
              style={{
                backgroundImage: "url('/delete.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 flex justify-between items-center w-full">
                <h2 className="text-white text-3xl font-semibold flex items-center gap-2">
                  Eliminar Registro
                </h2>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 text-center bg-white">
              <p className="mb-6 text-gray-800 text-base">
                ¿Estás seguro de que deseas eliminar este usuario?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => {
                    setDeleteModalIsOpen(false);
                    setSelectedUser(null);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
