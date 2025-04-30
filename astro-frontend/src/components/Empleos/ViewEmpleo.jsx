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
import { NewEmpleo } from "./NewEmpleo";
import { desactiveEmpleo } from "./Empleo.api";

export function ViewEmpleo() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedEmpleo, setSelectedEmpleo] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const fetchEmpleos = async () => {
    try {
      const token = localStorage.getItem("accessToken"); 
      const response = await fetch("http://localhost:3000/api/v1/empleo", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const empleos = await response.json();
      setData(empleos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleos();
  }, []);


  const filteredData = data.filter(
    (item) =>
      item.ceom && item.ceom.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelectedRowsChange = ({ selectedRows }) => {
    if (selectedRows.length > 0) {
      setSelectedEmpleo(selectedRows[0]);
    } else {
      setSelectedEmpleo(null);
    }
  };

  const handleEditClick = () => {
    if (selectedEmpleo) {
      setModalIsOpen(true);
    }
  };

  const handleDeleteClick = async () => {
    if (selectedEmpleo) {
      await desactiveEmpleo(selectedEmpleo.ceom);
      setDeleteModalIsOpen(false); // Cerrar modal después de eliminar
      setSelectedEmpleo(null);
      fetchEmpleos(); // Recargar datos después de eliminar
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false); // Cerrar modal
    setSelectedEmpleo(null);
  };

  const columns = [
    {
      name: "CEOM",
      selector: (row) => row.ceom || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Descripcion",
      selector: (row) => row.descripcion || "",
      sortable: true,
      className: "font-page",
    },
  ];

  if (loading) return <div className="text-center font-page">Cargando...</div>;

  // Exportar a Excel
  const exportToExcel = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ ceom, descripcion }) => ({
        CEOM: ceom,
        Descripcion: descripcion,
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Empleos");
      XLSX.writeFile(workbook, "empleos.xlsx");
    } else {
      alert("No hay datos para exportar");
    }
  };

  // Exportar a PDF
  const exportToPDF = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ ceom, descripcion }) => [
        ceom,
        descripcion,
      ]);
      const doc = new jsPDF();
      doc.autoTable({
        head: [["CEOM", "Descripcion"]],
        body: exportData,
      });
      doc.save("empleos.pdf");
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
            placeholder="Buscar empleo..."
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

      {selectedEmpleo && (
        <div className="flex items-center bg-primary text-white p-2 rounded-md mb-4">
          <span className="mr-4 font-page ml-7">
            Seleccionado: {selectedEmpleo.ceom}
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
            selectedEmpleo && row.ceom === selectedEmpleo.ceom
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

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[700px] rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold items-center text-[25px]">
                Actualizar Empleo
              </h2>
              <img
                src="/EMDN1.png" // Optional: Replace this with your actual logo path
                alt="Logo"
                className="h-14"
              />
            </div>

            {/* Modal Body */}
            <div className="px-6">
              <NewEmpleo
                ceom={selectedEmpleo.ceom}
                onClose={handleCloseModal}
                onUserSaved={fetchEmpleos}
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
                    setSelectedEmpleo(null);
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
