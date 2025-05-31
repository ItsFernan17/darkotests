// ViewPreguntaRespuesta.jsx
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
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { backendHost } from "../../utils/apiHost"; 

export function ViewPreguntaRespuesta() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const fetchPregunta = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${backendHost}/api/v1/pregunta-respuesta/preguntas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const preguntaRespuesta = await response.json();

      const formattedData = preguntaRespuesta.map((pregunta) => {
        const respuestas = pregunta.respuestas || [];
        while (respuestas.length < 3) {
          respuestas.push({ respuesta: "—", esCorrecta: "No aplica" });
        }
        return { ...pregunta, respuestas };
      });

      setData(formattedData);
      setLoading(false);
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
    setSelectedPregunta(selectedRows[0] || null);
  };

  const handleEditClick = () => {
    if (selectedPregunta) setModalIsOpen(true);
  };

  const handleDeleteClick = async () => {
    if (selectedPregunta) {
      await desactivePreguntaRespuesta(selectedPregunta.codigo_pregunta);
      setDeleteModalIsOpen(false);
      setSelectedPregunta(null);
      fetchPregunta();
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedPregunta(null);
  };

  const exportToExcel = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ descripcion, punteo, respuestas }) => ({
        Descripcion: descripcion,
        Punteo: punteo,
        Respuesta1: respuestas[0]?.respuesta,
        Correcta1: respuestas[0]?.esCorrecta,
        Respuesta2: respuestas[1]?.respuesta,
        Correcta2: respuestas[1]?.esCorrecta,
        Respuesta3: respuestas[2]?.respuesta,
        Correcta3: respuestas[2]?.esCorrecta,
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Preguntas");
      XLSX.writeFile(workbook, "preguntas.xlsx");
    } else {
      alert("No hay datos para exportar");
    }
  };

  const exportToPDF = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ descripcion, punteo, respuestas }) => [
        descripcion,
        punteo,
        respuestas[0]?.respuesta,
        respuestas[0]?.esCorrecta,
        respuestas[1]?.respuesta,
        respuestas[1]?.esCorrecta,
        respuestas[2]?.respuesta,
        respuestas[2]?.esCorrecta,
      ]);
      const doc = new jsPDF();
      doc.autoTable({
        head: [[
          "Descripcion",
          "Punteo",
          "Respuesta 1",
          "Correcta 1",
          "Respuesta 2",
          "Correcta 2",
          "Respuesta 3",
          "Correcta 3",
        ]],
        body: exportData,
      });
      doc.save("preguntas.pdf");
    } else {
      alert("No hay datos para exportar");
    }
  };

  const columns = [
    { name: "Pregunta", selector: (row) => row.descripcion, sortable: true, className: "font-page" },
    { name: "Tipo de Pregunta", selector: (row) => row.tipo_pregunta, sortable: true, className: "font-page" },
    { name: "Punteo", selector: (row) => row.punteo, sortable: true, className: "font-page" },
    ...[0, 1, 2].flatMap((i) => [
      { name: `Respuesta No. ${i + 1}`, selector: (row) => row.respuestas[i].respuesta, sortable: false, className: "font-page" },
      { name: "¿Correcta?", selector: (row) => row.respuestas[i].esCorrecta, sortable: false, className: "font-page" },
    ]),
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
            className="border bg-white p-2 pl-10 w-full rounded-2xl focus:outline-none focus:ring font-page"
            placeholder="Buscar pregunta..."
          />
        </div>

        <div className="flex ml-4 items-center translate-x-[550px] space-x-3">
          <span className="font-page font-semibold text-[16px] text-primary">Exportar en:</span>
          <button className="bg-[#0f763d] text-white border p-2 rounded" onClick={exportToExcel}><FaFileExcel /></button>
          <button className="bg-[#da1618] text-white p-2 rounded" onClick={exportToPDF}><FaFilePdf /></button>
        </div>
      </div>

      {selectedPregunta && (
        <div className="flex items-center h-14 justify-between bg-white border shadow-sm rounded-xl p-4 mb-6">
          <div className="text-gray-800 text-base font-medium">
            <span className="ml-2">📝 <strong>Seleccionado:</strong> {selectedPregunta.descripcion}</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <FaEdit className="size-4" /> Editar
            </button>
            <button
              onClick={() => setDeleteModalIsOpen(true)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              <FaTrashAlt className="size-4" /> Eliminar
            </button>
          </div>
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

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.25 }} className="bg-white w-full max-w-xl rounded-2xl shadow-lg">
            <div className="relative h-32 flex items-end px-6 py-4 rounded-t-2xl overflow-hidden" style={{ backgroundImage: "url('/mod.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex justify-between items-center w-full">
                <h2 className="text-white text-3xl font-semibold">Actualizar Pregunta</h2>
              </div>
              <button onClick={handleCloseModal} className="absolute top-3 right-3 z-10 text-white hover:text-red-300"><X size={22} /></button>
            </div>
            <div className="p-6 bg-white">
              <NewPreguntaRespuestas id={selectedPregunta.codigo_pregunta} onClose={handleCloseModal} onUserSaved={fetchPregunta} />
            </div>
          </motion.div>
        </div>
      )}

      {deleteModalIsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-28 flex items-end px-6 py-4 rounded-t-2xl overflow-hidden" style={{ backgroundImage: "url('/delete.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black/50" />
              <h2 className="relative z-10 text-white text-3xl font-semibold">Eliminar Pregunta</h2>
            </div>
            <div className="p-6 text-center bg-white">
              <p className="mb-6 text-gray-800 text-base">¿Estás seguro de eliminar esta pregunta?</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleDeleteClick} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg">Eliminar</button>
                <button onClick={() => { setDeleteModalIsOpen(false); setSelectedPregunta(null); }} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg">Cancelar</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
