// AsignacionCards.jsx
import { useEffect, useState } from "react";
import { FileText, PlayCircle } from "lucide-react";
import { logoBase64 } from "../../constants/logoBase64";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

export function AsignacionCards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/api/v1/asignacion", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const asignaciones = await response.json();
      setData(asignaciones);
    } catch (err) {
      console.error("Error al obtener asignaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (codigoExamen, codigoAsignacion) => {
    localStorage.setItem("codigo_examen", codigoExamen);
    localStorage.setItem("codigo_asignacion", codigoAsignacion);
    window.location.href = "/portal/examen/evaluacion";
  };

const handleGeneratePDF = async (codigoAsignacion) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:3000/api/v1/asignacion/${codigoAsignacion}/datos`,
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

  const filteredData = data.filter((item) => {
    const motivo = item.examen?.motivo_examen?.nombre_motivo?.toLowerCase() || "";
    return motivo.includes("");
  });

  

  if (loading) return <div className="text-center font-page">Cargando asignaciones...</div>;

  return (
    <div className="w-full p-5">
      {filteredData.length === 0 ? (
        <div className="text-center mt-12">
          <img src="/cards/no-exam.webp" alt="Sin exámenes" className="w-60 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((row, i) => (
            <div key={row.codigo_asignacion} className="rounded-xl overflow-hidden shadow-md border bg-white relative">
              <div
                className="h-52 relative bg-cover bg-center"
                style={{ backgroundImage: `url(/cards/card${Math.floor(Math.random() * 5) + 1}.webp)` }}
              >
                
              </div>
              <div className="p-5 space-y-2 bg-white relative z-10">
                <p><strong>Examen:</strong> {row.examen?.motivo_examen?.nombre_motivo}</p>
                <p><strong>Tipo:</strong> {row.examen?.tipo_examen?.description}</p>
                <p><strong>Punteo:</strong> {row.punteo === null ? "No evaluado" : row.punteo}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleRedirect(row.examen.codigo_examen, row.codigo_asignacion)}
                    disabled={row.punteo !== null}
                    className={`flex items-center gap-2 px-4 py-2 rounded transition-all font-semibold ${row.punteo === null ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                  >
                    <PlayCircle size={18} /> Ir al Examen
                  </button>
                  <button
                    onClick={() => handleGeneratePDF(row.codigo_asignacion)}
                    disabled={row.punteo === null}
                    className={`flex items-center gap-2 px-4 py-2 rounded transition-all font-semibold ${row.punteo !== null ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                  >
                    <FileText size={18} /> Generar PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
