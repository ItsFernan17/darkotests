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
import { NewAsignacion } from "./NewAsigancion";
import { desactiveAsignacion } from "./Asignaciones.api";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { logoBase64 } from "../../constants/logoBase64";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { backendHost } from "../../utils/apiHost"; 
pdfMake.vfs = pdfFonts.vfs;

export function ViewAsignacion() {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userDPI, setUserDPI] = useState(null);
  const [toggleCleared, setToggleCleared] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const dpi = localStorage.getItem("dpi");
    setUserRole(role);
    setUserDPI(dpi);
  }, []);

  const fetchAsignaciones = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${backendHost}/api/v1/asignacion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const asignaciones = await response.json();
      setData(asignaciones);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        if (userRole === "evaluado") {
          const motivoExamen =
            typeof item.examen?.motivo_examen?.nombre_motivo === "string"
              ? item.examen.motivo_examen.nombre_motivo.toLowerCase()
              : "";
          return motivoExamen.includes(filterText.toLowerCase());
        } else if (userRole === "evaluador" || userRole === "admin") {
          return item.evaluado?.nombre_completo
            ?.toLowerCase()
            .includes(filterText.toLowerCase());
        }
        return false;
      })
    : [];

  const handleSelectedRowsChange = ({ selectedRows }) => {
    if (selectedRows.length > 0) {
      setSelectedAsignacion(selectedRows[0]);
    } else {
      setSelectedAsignacion(null);
    }
  };

  const handleEditClick = () => {
    if (selectedAsignacion) {
      setModalIsOpen(true);
    }
  };

  const handleDeleteClick = async () => {
    if (selectedAsignacion) {
      await desactiveAsignacion(selectedAsignacion.codigo_asignacion);
      setDeleteModalIsOpen(false);
      setSelectedAsignacion(null);
      fetchAsignaciones();
    }
  };

  const handleSaveAndRedirect = (codigoExamen, codigoAsignacion) => {
    if (codigoExamen && codigoAsignacion) {
      localStorage.setItem("codigo_examen", codigoExamen);
      localStorage.setItem("codigo_asignacion", codigoAsignacion);
      window.location.href = `/portal/examen/evaluacion`;
    } else {
      alert("Código de examen o asignación no válido");
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedAsignacion(null);
  };

  const exportToExcel = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ evaluado, examen, punteo }) => ({
        Evaluado: evaluado?.nombre_completo || evaluado || "",
        Examen: examen?.motivo_examen.nombre_motivo || examen || "",
        "Tipo de Examen": examen?.tipo_examen.description || examen || "",
        Punteo: punteo === null ? "No evaluado" : `${punteo}`,
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Asignaciones");
      XLSX.writeFile(workbook, "asignaciones.xlsx");
    } else {
      alert("No hay datos para exportar");
    }
  };

  const exportToPDF = () => {
    if (filteredData.length > 0) {
      const exportData = filteredData.map(({ evaluado, examen, punteo }) => [
        evaluado?.nombre_completo || evaluado || "",
        examen?.motivo_examen.nombre_motivo || examen || "",
        examen?.tipo_examen.description || examen || "",
        punteo === null ? "No evaluado" : `${punteo}`,
      ]);
      const doc = new jsPDF();
      doc.autoTable({
        head: [["Evaluado", "Examen", "Tipo de Examen", "Punteo"]],
        body: exportData,
      });
      doc.save("asignaciones.pdf");
    } else {
      alert("No hay datos para exportar");
    }
  };

  if (loading) {
    return <div className="text-center font-page">Cargando...</div>;
  }

  const columns = [
    {
      name: "Evaluado",
      selector: (row) => row.evaluado?.nombre_completo || row.evaluado || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Examen",
      selector: (row) =>
        row.examen?.motivo_examen.nombre_motivo || row.examen || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Tipo de Examen",
      selector: (row) =>
        row.examen?.tipo_examen.description || row.examen || "",
      sortable: true,
      className: "font-page",
    },
    {
      name: "Punteo",
      selector: (row) => {
        return row.punteo === null ? "No evaluado" : `${row.punteo}`;
      },
      sortable: true,
      className: "font-page",
    },
    ...(userRole === "evaluado"
      ? [
          {
            name: "Acciones",
            cell: (row) => (
              <button
                onClick={() =>
                  handleSaveAndRedirect(
                    row.examen.codigo_examen,
                    row.codigo_asignacion
                  )
                }
                className={`text-[#0f763d] px-4 py-2 rounded ${row.punteo === null ? "" : "opacity-50 cursor-not-allowed"}`}
                disabled={row.punteo !== null}
              >
                {row.punteo === null ? "Ir al Examen" : "Examen completado"}
              </button>
            ),
            ignoreRowClick: true,
          },
        ]
      : []),

    {
      name: "Certificación",
      cell: (row) => (
        <button
          onClick={() => handleGeneratePDF(row.codigo_asignacion)}
          disabled={row.punteo === null}
          className={`${
            row.punteo !== null
              ? "text-[#0f763d]"
              : "text-gray-700 cursor-not-allowed"
          } px-4 py-2 rounded`}
        >
          Generar PDF
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  const handleGeneratePDF = async (codigoAsignacion) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${backendHost}/api/v1/asignacion/${codigoAsignacion}/datos`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const asignacion = await response.json();

      if (asignacion.punteo === null) {
        alert("Este examen no tiene punteo registrado.");
        return;
      }

        const docDefinition = {
          pageSize: 'LETTER',
          pageMargins: [40, 60, 40, 80],
          content: [
            {
              image: logoBase64, // logo centrado
              width: 200,
              alignment: 'center',
              margin: [0, 0, 0, 10],
            },
            {
              text: 'Laboratorio de Evaluaciones – DarkoTests',
              alignment: 'center',
              bold: true,
              fontSize: 13,
              margin: [0, 0, 0, 5],
            },
            {
              text: 'CONSTANCIA DE EVALUACIÓN',
              alignment: 'center',
              color: '#D32F2F',
              bold: true,
              fontSize: 14,
              margin: [0, 0, 0, 10],
            },
            {
              text:
                'Mediante la presente, se hace constar que el evaluado ha cumplido satisfactoriamente con el proceso de evaluación estipulado por el sistema oficial de DarkoTests. Dicho proceso se ha desarrollado bajo lineamientos técnicos y metodológicos que garantizan la objetividad de los resultados, mismos que reflejan el rendimiento alcanzado conforme a los criterios establecidos para el tipo de examen aplicado.',
              alignment: 'justify',
              fontSize: 11,
              lineHeight: 1.5,
              margin: [0, 0, 0, 20],
            },
            {
              text: 'DATOS DEL EVALUADO',
              style: 'seccion',
            },
            {
              columns: [
                { text: `Nombre Completo: ${asignacion.evaluado.nombre_completo}`, width: '50%' },
                { text: `DPI: ${asignacion.evaluado.dpi}`, width: '50%' },
              ],
            },
            {
              columns: [
                { text: `Teléfono: ${asignacion.evaluado.telefono}`, width: '50%' },
                { text: `Residencia: ${asignacion.evaluado.residencia}`, width: '50%' },
              ],
              margin: [0, 0, 0, 15],
            },
            {
              text: 'RESULTADOS DE LA EVALUACIÓN',
              style: 'seccion',
            },
            {
              table: {
                widths: ['*', '*'],
                body: [
                  ['Fecha de Evaluación', asignacion.examen.fecha_evaluacion],
                  ['Punteo Máximo', asignacion.examen.punteo_maximo],
                  ['Punteo Obtenido', asignacion.punteo],
                  ['Motivo del Examen', asignacion.examen.motivo_examen],
                  ['Tipo de Examen', asignacion.examen.tipo_examen],
                ],
              },
              layout: 'fullGrid', // todos los bordes
              margin: [0, 0, 0, 20],
            },
            {
              text: `Promedio General: ${(
                (asignacion.punteo / asignacion.examen.punteo_maximo) *
                100
              ).toFixed(2)}%`,
              bold: true,
              alignment: 'right',
              fontSize: 12,
              margin: [0, 0, 0, 20],
            },
            {
              text: `Fecha de emisión: ${new Date().toLocaleDateString()}`,
              fontSize: 10,
              italics: true,
              margin: [0, 0, 0, 40],
            },
            {
              qr: `https://darkotests.com/verificar-certificado/${asignacion.evaluado.dpi}`,
              alignment: 'center',
              fit: 100,
            },
            {
              text: 'Esta constancia tiene validez hasta el 31/12/2025.',
              alignment: 'center',
              fontSize: 9,
              italics: true,
              margin: [0, 10, 0, 0],
            },
          ],
          styles: {
            seccion: {
              fontSize: 12,
              bold: true,
              margin: [0, 10, 0, 8],
              color: '#333',
            },
          },
        };
        
        

      pdfMake
        .createPdf(docDefinition)
        .download(`Certificado_${asignacion.evaluado.nombre_completo}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Error al generar el PDF. Intente nuevamente.");
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
            className="border bg-white p-2 pl-10 w-full rounded-2xl focus:outline-none focus:ring font-page"
            placeholder="Buscar asignación..."
          />
        </div>

        <div className="flex ml-4 items-center translate-x-[550px] space-x-3">
          <span className="font-page font-semibold text-[16px] text-primary">
            Exportar en:
          </span>
          <button
            className="bg-[#0f763d] text-white border p-2 rounded"
            onClick={exportToExcel}
          >
            <FaFileExcel />
          </button>
          <button
            className="bg-[#da1618] text-white p-2 rounded"
            onClick={exportToPDF}
          >
            <FaFilePdf />
          </button>
        </div>
      </div>

{selectedAsignacion && (
  <div className="flex items-center h-14 justify-between bg-white border shadow-sm rounded-xl p-4 mb-6">
    <div className="text-gray-800 text-base font-medium">
      <span className="ml-2">
        📝 <strong>Seleccionado:</strong>{" "}
        {selectedAsignacion.evaluado.nombre_completo}
      </span>
    </div>

    {(!selectedAsignacion.punteo || selectedAsignacion.punteo === 0) ? (
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
    ) : (
      <div className="text-sm text-gray-600 italic px-4 py-2 rounded-lg">
        Ya fue examinado. No se permite editar ni eliminar esta asignación.
      </div>
    )}
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
            selectedAsignacion?.codigo_asignacion === row.codigo_asignacion
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
            <div
              className="relative h-32 flex items-end px-6 py-4 rounded-t-2xl overflow-hidden"
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

            <div className="p-6 bg-white">
              <NewAsignacion
                codigo_asignacion={selectedAsignacion.codigo_asignacion}
                onClose={() => {
                  setModalIsOpen(false);
                  setSelectedAsignacion(null);
                }}
                onUserSaved={() => {
                  fetchAsignaciones();
                  setSelectedAsignacion(null); // <- Aquí también puedes limpiar
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de eliminación */}
      {deleteModalIsOpen && selectedAsignacion && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div
              className="relative h-28 bg-cover bg-center"
              style={{ backgroundImage: "url('/delete.webp')" }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <h2 className="relative z-10 text-white text-3xl font-semibold p-4">
                Eliminar Asignación
              </h2>
            </div>
            <div className="p-6 text-center">
              <p className="mb-6 text-gray-800 text-base">
                ¿Estás seguro de eliminar esta asignación?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setDeleteModalIsOpen(false)}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg"
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
