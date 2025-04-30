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
import { NewPreguntaRespuestas } from "./NewPreguntaRespuestas";
import { desactivePreguntaRespuesta } from "./PreguntaRespuesta.api";

export function ViewPreguntaRespuesta() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const fetchPregunta = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Obtener el token de localStorage

      const response = await fetch(
        "http://localhost:3000/api/v1/pregunta-respuesta/preguntas",
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const preguntaRespuesta = await response.json();

      // Asegurarse de que siempre haya 3 respuestas, llenando con "NULL" si es necesario
      const formattedData = preguntaRespuesta.map((pregunta) => {
        const respuestas = pregunta.respuestas || [];
        while (respuestas.length < 3) {
          respuestas.push({ respuesta: "NULL", esCorrecta: "NULL" });
        }
        return { ...pregunta, respuestas };
      });

      setData(formattedData); // Actualizamos el estado de la tabla
      setLoading(false); // Desactivamos el estado de carga
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPregunta();
  }, []);


  const filteredData = data.filter((item) =>
    item.descripcion.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelectedRowsChange = ({ selectedRows }) => {
    if (selectedRows.length > 0) {
      setSelectedPregunta(selectedRows[0]);
    } else {
      setSelectedPregunta(null);
    }
  };

  const handleEditClick = () => {
    if (selectedPregunta) {
      setModalIsOpen(true);
    }
  };

  const handleDeleteClick = async () => {
    if (selectedPregunta) {
      await desactivePreguntaRespuesta(selectedPregunta.codigo_pregunta);
      setDeleteModalIsOpen(false); // Cerrar modal después de eliminar
      setSelectedPregunta(null);
      fetchPregunta(); // Recargar datos después de eliminar
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false); // Cerrar modal
    setSelectedPregunta(null);
  };

  const columns = [
    {
      name: "Pregunta",
      selector: (row) => row.descripcion || "",
      sortable: true,
      className: "font-page",
    },
    {
        name: "Tipo de Pregunta",
        selector: (row) => row.tipo_pregunta || "",
        sortable: true,
        className: "font-page",
      },
    {
      name: "Punteo",
      selector: (row) => row.punteo || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Respuesta No. 1",
      selector: (row) => row.respuestas[0]?.respuesta || "NULL",
      sortable: false,
      className: "font-page",
    },
    {
      name: "¿Correcta?",
      selector: (row) => row.respuestas[0]?.esCorrecta || "NULL",
      sortable: false,
      className: "font-page",
    },
    {
      name: "Respuesta No. 2",
      selector: (row) => row.respuestas[1]?.respuesta || "NULL",
      sortable: false,
      className: "font-page",
    },
    {
      name: "¿Correcta?",
      selector: (row) => row.respuestas[1]?.esCorrecta || "NULL",
      sortable: false,
      className: "font-page",
    },
    {
      name: "Respuesta No. 3",
      selector: (row) => row.respuestas[2]?.respuesta || "NULL",
      sortable: false,
      className: "font-page",
    },
    {
      name: "¿Correcta?",
      selector: (row) => row.respuestas[2]?.esCorrecta || "NULL",
      sortable: false,
      className: "font-page",
    },
  ];

  if (loading) return <div className="text-center font-page">Cargando...</div>;

  // Exportar a Excel
  const exportToExcel = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(
        ({ descripcion, punteo, respuestas }) => ({
          Descripcion: descripcion,
          Punteo: punteo,
          Respuesta1: respuestas[0]?.respuesta || "NULL",
          Correcta1: respuestas[0]?.esCorrecta || "NULL",
          Respuesta2: respuestas[1]?.respuesta || "NULL",
          Correcta2: respuestas[1]?.esCorrecta || "NULL",
          Respuesta3: respuestas[2]?.respuesta || "NULL",
          Correcta3: respuestas[2]?.esCorrecta || "NULL",
        })
      );
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Preguntas");
      XLSX.writeFile(workbook, "preguntas.xlsx");
    } else {
      alert("No hay datos para exportar");
    }
  };

  // Exportar a PDF
  const exportToPDF = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(
        ({ descripcion, punteo, respuestas }) => [
          descripcion,
          punteo,
          respuestas[0]?.respuesta || "NULL",
          respuestas[0]?.esCorrecta || "NULL",
          respuestas[1]?.respuesta || "NULL",
          respuestas[1]?.esCorrecta || "NULL",
          respuestas[2]?.respuesta || "NULL",
          respuestas[2]?.esCorrecta || "NULL",
        ]
      );
      const doc = new jsPDF();
      doc.autoTable({
        head: [
          [
            "Descripcion",
            "Punteo",
            "Respuesta 1",
            "Correcta 1",
            "Respuesta 2",
            "Correcta 2",
            "Respuesta 3",
            "Correcta 3",
          ],
        ],
        body: exportData,
      });
      doc.save("preguntas.pdf");
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
            className="border  bg-[#F7FAFF] p-2 pl-10 w-full rounded-md focus:outline-none focus:ring focus:border-blue-300 font-page"
            placeholder="Buscar pregunta..."
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

      {selectedPregunta && (
        <div className="flex items-center bg-primary text-white p-2 rounded-md mb-4">
          <span className="mr-4 font-page ml-7">
            Seleccionado: {selectedPregunta.descripcion}
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
            selectedPregunta && row.descripcion === selectedPregunta.descripcion
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

      {modalIsOpen && selectedPregunta && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[700px] rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between bg-primary text-white py-3 px-5 rounded-t-md">
              <h2 className="font-page font-semibold items-center text-[25px]">
                Actualizar Pregunta y Respuestas
              </h2>
              <img
                src="/EMDN1.png" // Optional: Replace this with your actual logo path
                alt="Logo"
                className="h-14"
              />
            </div>

            {/* Modal Body */}
            <div className="px-6">
              <NewPreguntaRespuestas
                id={selectedPregunta.codigo_pregunta} // Aquí pasas el ID sin mostrarlo en la tabla
                onClose={handleCloseModal}
                onUserSaved={fetchPregunta}
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
