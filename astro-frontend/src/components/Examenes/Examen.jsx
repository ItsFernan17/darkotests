import React, { useState } from 'react';
import { backendHost } from "../../utils/apiHost"; 

const Examen = () => {
  const [fechaEvaluacion, setFechaEvaluacion] = useState('');
  const [tipoExamen, setTipoExamen] = useState('');
  const [punteoMaximo, setPunteoMaximo] = useState('');
  const [usuarioIngreso, setUsuarioIngreso] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      fecha_evaluacion: fechaEvaluacion,
      tipo_examen: parseInt(tipoExamen),
      punteo_maximo: parseFloat(punteoMaximo),
      usuario_ingreso: usuarioIngreso,
    };

    try {
      const response = await fetch(`http://${backendHost}:3000/examen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje('Examen creado exitosamente');
        // Limpiar el formulario si lo deseas
        setFechaEvaluacion('');
        setTipoExamen('');
        setPunteoMaximo('');
        setUsuarioIngreso('');
      } else {
        const errorData = await response.json();
        setMensaje(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al crear el examen');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Crear Nuevo Examen</h1>
      {mensaje && <p className="mb-4 text-center text-red-500">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Fecha de Evaluación:</label>
          <input
            type="date"
            value={fechaEvaluacion}
            onChange={(e) => setFechaEvaluacion(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Tipo de Examen:</label>
          <input
            type="number"
            value={tipoExamen}
            onChange={(e) => setTipoExamen(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Punteo Máximo:</label>
          <input
            type="number"
            step="0.01"
            value={punteoMaximo}
            onChange={(e) => setPunteoMaximo(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Usuario de Ingreso:</label>
          <input
            type="text"
            value={usuarioIngreso}
            onChange={(e) => setUsuarioIngreso(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Crear Examen
        </button>
      </form>
    </div>
  );
};

export default Examen;
