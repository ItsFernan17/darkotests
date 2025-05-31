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
import { NewTipoExamen } from "./NewTipoExamen";
import { desactiveTipoExamen } from "./TipoExamen.api";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { backendHost } from "../../utils/apiHost"; 

export function ViewTipoExamen() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedTipoExamen, setSelectedTipoExamen] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const fetchTiposExamen = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${backendHost}/api/v1/tipo-examen`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error();
      const tipos = await response.json();
      setData(tipos);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposExamen();
  }, []);

  const filteredData = data.filter(
    (item) =>
      (item.description &&
        item.description.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.ceom &&
        item.ceom.ceom.toLowerCase().includes(filterText.toLowerCase()))
  );

  const columns = [
    {
      name: "Descripción",
      selector: (row) => row.description || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "CEOM",
      selector: (row) => row.ceom?.ceom || "",
      sortable: true,
      className: "font-page",
    },
  ];

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedTipoExamen(selectedRows.length > 0 ? selectedRows[0] : null);
  };

  const exportToExcel = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ description, ceom }) => ({
        Descripción: description,
        CEOM: ceom?.ceom || "N/A",
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TiposExamen");
      XLSX.writeFile(workbook, "tipos_examen.xlsx");
    } else alert("No hay datos para exportar");
  };

  const exportToPDF = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ description, ceom }) => [
        description,
        ceom?.ceom || "N/A",
      ]);
      const doc = new jsPDF();
      doc.autoTable({
        head: [["Descripción", "CEOM"]],
        body: exportData,
      });
      doc.save("tipos_examen.pdf");
    } else alert("No hay datos para exportar");
  };

  const handleEditClick = () => selectedTipoExamen && setModalIsOpen(true);
  const handleDeleteClick = async () => {
    if (selectedTipoExamen) {
      await desactiveTipoExamen(selectedTipoExamen.codigo_tipoE);
      setDeleteModalIsOpen(false);
      setSelectedTipoExamen(null);
      fetchTiposExamen();
    }
  };
  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedTipoExamen(null);
  };

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
            className="border bg-white p-2 pl-10 w-full rounded-2xl focus:outline-none focus:ring focus:border-blue-300 font-page"
            placeholder="Buscar tipo de examen..."
          />
        </div>

        <div className="flex ml-4 items-center translate-x-[550px] space-x-3">
          <span className="font-page font-semibold text-[16px] text-primary">
            Exportar en:
          </span>
          <button
            className="bg-[#0f763d] text-white border border-[#0f763d] p-2 rounded"
            onClick={exportToExcel}
          >
            <FaFileExcel className="size-5" />
          </button>
          <button
            className="bg-[#da1618] text-white p-2 rounded"
            onClick={exportToPDF}
          >
            <FaFilePdf className="size-5" />
          </button>
        </div>
      </div>

      {selectedTipoExamen && (
        <div className="flex items-center h-14 justify-between bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6">
          <div className="text-gray-800 text-base font-medium">
            <span className="ml-2">
              📝 <strong>Seleccionado:</strong> {selectedTipoExamen.description}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <FaEdit className="size-4" />
              Editar
            </button>
            <button
              onClick={() => setDeleteModalIsOpen(true)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              <FaTrashAlt className="size-4" />
              Eliminar
            </button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5]}
        highlightOnHover
        noDataComponent={<div className="font-page">No hay registros</div>}
        selectableRows
        onSelectedRowsChange={handleSelectedRowsChange}
        paginationComponentOptions={{
          rowsPerPageText: "Mostrando",
          rangeSeparatorText: "de",
        }}
        selectableRowsSingle
        selectableRowSelected={(row) =>
          selectedTipoExamen &&
          row.codigo_tipoE === selectedTipoExamen.codigo_tipoE
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

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-full max-w-xl rounded-2xl shadow-lg"
          >
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
                  Actualizar Tipo de Examen
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
            <div className="p-6 bg-white">
              <NewTipoExamen
                codigo_tipoE={selectedTipoExamen.codigo_tipoE}
                onClose={handleCloseModal}
                onUserSaved={fetchTiposExamen}
              />
            </div>
          </motion.div>
        </div>
      )}

      {deleteModalIsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
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
                  Eliminar Tipo de Examen
                </h2>
              </div>
            </div>
            <div className="p-6 text-center bg-white">
              <p className="mb-6 text-gray-800 text-base">
                ¿Estás seguro de que deseas eliminar este tipo de examen?
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
                    setSelectedTipoExamen(null);
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
