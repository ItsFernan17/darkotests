import { backendHost } from "../../utils/apiHost"; 

export async function createTipoExamen(newTipoExamen: any) {
  const token = localStorage.getItem('accessToken'); // Obtener el token de localStorage

  try {
    const response = await fetch(`http://${backendHost}:3000/api/v1/tipo-examen/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Agregar el token en el encabezado
      },
      body: JSON.stringify(newTipoExamen),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return data; // Retorna los datos para poder ser utilizados
  } catch (error) {
    console.error('Error creando tipo de examen:', error);
    throw error; // Para que el error pueda ser manejado en el nivel superior
  }
}

export async function updateTipoExamen(codigo_tipoE: number, newTipoExamen: any) {
  const token = localStorage.getItem('accessToken'); // Obtener el token de localStorage

  try {
    const response = await fetch(`http://${backendHost}:3000/api/v1/tipo-examen/${codigo_tipoE}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Agregar el token en el encabezado
      },
      body: JSON.stringify(newTipoExamen),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json(); // Retorna los datos actualizados para su uso
  } catch (error) {
    console.error('Error actualizando tipo de examen:', error);
    throw error;
  }
}

export async function desactiveTipoExamen(codigo_tipoE: number) {
  const token = localStorage.getItem('accessToken'); // Obtener el token de localStorage

  try {
    const response = await fetch(`http://${backendHost}:3000/api/v1/tipo-examen/${codigo_tipoE}/estado`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`, // Agregar el token en el encabezado
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json(); // Retorna el resultado después de desactivar el tipo de examen
  } catch (error) {
    console.error('Error desactivando tipo de examen:', error);
    throw error;
  }
}
