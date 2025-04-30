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
import { NewExamen } from "./NewExamen";
import { desactiveExamen } from "./Examen.api";

export function ViewExamen() {
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedExamen, setSelectedExamen] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  
    function getToken() {
      return localStorage.getItem('accessToken'); // Obtener el token del localStorage
    }
    
    const fetchExamenes = async () => {
      try {
        const token = getToken(); // Obtener el token
    
        const response = await fetch("http://localhost:3000/api/v1/examen", {
          headers: {
            'Authorization': `Bearer ${token}`, // Agregar el token en el encabezado
            'Content-Type': 'application/json', // Especificar el tipo de contenido
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const examenes = await response.json();
        setData(examenes); // Actualizar el estado con los datos recibidos
        setLoading(false); // Desactivar el estado de carga
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false); // Desactivar el estado de carga en caso de error
      }
    };
    
    useEffect(() => {
      fetchExamenes();
    }, []);
    
  
    const filteredData = data.filter(
      (item) =>
        (item.fecha_evaluacion && item.fecha_evaluacion.toString().includes(filterText)) ||
        (item.tipo_examen && item.tipo_examen.description.toLowerCase().includes(filterText.toLowerCase()))
    );
  
    const handleSelectedRowsChange = ({ selectedRows }) => {
      if (selectedRows.length > 0) {
        setSelectedExamen(selectedRows[0]);
      } else {
        setSelectedExamen(null);
      }
    };
  
    const handleEditClick = () => {
      if (selectedExamen) {
        setModalIsOpen(true);
      }
    };
  
    const handleDeleteClick = async () => {
      if (selectedExamen) {
        await desactiveExamen(selectedExamen.codigo_examen);
        setDeleteModalIsOpen(false);
        setSelectedExamen(null);
        fetchExamenes();
      }
    };
  
    const handleCloseModal = () => {
      setModalIsOpen(false);
      setSelectedExamen(null);
    };
  
    const columns = [
      {
        name: "Fecha Evaluación",
        selector: (row) => row.fecha_evaluacion || "",
        sortable: true,
        className: "font-page",
      },
      {
        name: "Tipo de Examen",
        selector: (row) => row.tipo_examen.description || "",
        sortable: true,
        className: "font-page",
      },
      {
        name: "Motivo del Examen",
        selector: (row) => row.motivo_examen.nombre_motivo || "",
        sortable: true,
        className: "font-page",
      },
      {
        name: "Punteo Máximo",
        selector: (row) => row.punteo_maximo || "",
        sortable: true,
        className: "font-page",
      },
    ];
  
    if (loading) return <div className="text-center font-page">Cargando...</div>;
  
    // Exportar a Excel
    const exportToExcel = () => {
      if (filteredData.length > 0) {
        const exportData = filteredData.map(
          ({
            fecha_evaluacion,
            tipo_examen,
            motivo_examen,
            punteo_maximo,
          }) => ({
            "Fecha Evaluación": fecha_evaluacion,
            "Tipo de Examen": tipo_examen.description,
            "Motivo del Examen": motivo_examen.nombre_motivo,
            "Punteo Máximo": punteo_maximo,
          })
        );
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Exámenes");
        XLSX.writeFile(workbook, "examenes.xlsx");
      } else {
        alert("No hay datos para exportar");
      }
    };
  
    // Exportar a PDF
    const exportToPDF = () => {
      if (filteredData.length > 0) {
        const exportData = filteredData.map(
          ({
            fecha_evaluacion,
            tipo_examen,
            motivo_examen,
            punteo_maximo,
          }) => [
            fecha_evaluacion,
            tipo_examen.description,
            motivo_examen.nombre_motivo,
            punteo_maximo,
          ]
        );
        const doc = new jsPDF();
        doc.autoTable({
          head: [
            [
              "Fecha Evaluación",
              "Tipo de Examen",
              "Motivo del Examen",
              "Punteo Máximo",
            ],
          ],
          body: exportData,
        });
        doc.save("examenes.pdf");
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
              placeholder="Buscar examen..."
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
  
        {selectedExamen && (
          <div className="flex items-center bg-primary text-white p-2 rounded-md mb-4">
            <span className="mr-4 font-page ml-7">
              Seleccionado: {selectedExamen.fecha_evaluacion}
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
                selectedExamen && row.codigo_examen === selectedExamen.codigo_examen
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
    <div className="bg-white w-[700px] max-h-[90vh] rounded-lg shadow-lg overflow-hidden">
      {/* Modal Header */}
      <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
        <h2 className="font-page font-semibold items-center text-[25px]">
          Actualizar Examen
        </h2>
        <img src="/EMDN1.png" alt="Logo" className="h-14" />
      </div>

      {/* Modal Body (Scrollable) */}
      <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
        <NewExamen
          codigo_examen={selectedExamen.codigo_examen}
          onClose={handleCloseModal}
          onUserSaved={fetchExamenes}
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
                        setSelectedExamen(null);
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
