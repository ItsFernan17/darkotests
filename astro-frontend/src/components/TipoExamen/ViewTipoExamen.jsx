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

export function ViewTipoExamen() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedTipoExamen, setSelectedTipoExamen] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const fetchTiposExamen = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch("http://localhost:3000/api/v1/tipo-examen", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const tiposExamen = await response.json();
      setData(tiposExamen);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
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
      (item.ceom && item.ceom.ceom.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleSelectedRowsChange = ({ selectedRows }) => {
    if (selectedRows.length > 0) {
      setSelectedTipoExamen(selectedRows[0]);
    } else {
      setSelectedTipoExamen(null);
    }
  };

  const handleEditClick = () => {
    if (selectedTipoExamen) {
      setModalIsOpen(true);
    }
  };

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

  if (loading) return <div className="text-center font-page">Cargando...</div>;

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
    } else {
      alert("No hay datos para exportar");
    }
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
    } else {
      alert("No hay datos para exportar");
    }
  };

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
            className="border bg-[#F7FAFF] p-2 pl-10 w-full rounded-md focus:outline-none focus:ring focus:border-blue-300 font-page"
            placeholder="Buscar tipo de examen..."
          />
        </div>

        <div className="flex ml-4 items-center translate-x-[550px] space-x-3">
          <span className="font-page font-semibold text-[16px] text-primary">
            Exportar en:
          </span>
          <button
            className="bg-[#0f763d] text-white border border-[#0f763d] p-2 rounded flex justify-center items-center"
            onClick={exportToExcel}
          >
            <FaFileExcel className="size-5" />
          </button>


          <button
            className="bg-[#da1618] text-white p-2 rounded flex justify-center items-center"
            onClick={exportToPDF}
          >
            <FaFilePdf className="size-5" />
          </button>
        </div>
      </div>

      {selectedTipoExamen && (
        <div className="flex items-center bg-primary text-white p-2 rounded-md mb-4">
          <span className="mr-4 font-page ml-7">
            Seleccionado: {selectedTipoExamen.description}
          </span>
          <button
            onClick={handleEditClick}
            className="flex items-center text-primary bg-[#FFFFFF] px-4 py-2 ml-[760px] rounded-[10px] mr-2"
          >
            <FaEdit className="size-5" />
          </button>
          <button
            onClick={() => setDeleteModalIsOpen(true)}
            className="flex items-center text-primary bg-[#ED8080] px-4 py-2 rounded-[10px]"
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
            selectedTipoExamen && row.codigo_tipoE === selectedTipoExamen.codigo_tipoE
          }
          customStyles={{
            headCells: {
              style: {
                color: "#142957",
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
              },
            },
            rows: {
              style: {
                backgroundColor: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#E7EBF8 !important", 
                },
                minHeight: "48px",
              },
            },
            cells: {
              style: {
                paddingLeft: "10px",
                paddingRight: "10px",
                fontSize: "14px",
                color: "#142957",
              },
            },
            pagination: {
              style: {
                backgroundColor: "none", 
                padding: "10px", 
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

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[700px] rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold items-center text-[25px]">
                Actualizar Tipo de Examen
              </h2>
              <img
                src="/EMDN1.png" 
                alt="Logo"
                className="h-14"
              />
            </div>

            {/* Modal Body */}
            <div className="px-6">
              <NewTipoExamen
                codigo_tipoE={selectedTipoExamen.codigo_tipoE}
                onClose={handleCloseModal}
                onUserSaved={fetchTiposExamen}
              />
            </div>
          </div>
        </div>
      )}

      {deleteModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] rounded-lg shadow-lg">
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold items-center text-[25px]">
                Confirmación de Eliminación
              </h2>
              <img
                src="/EMDN1.png" 
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
                    setSelectedTipoExamen(null);
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
