import { backendHost } from "../../utils/apiHost"; 

const getToken = () => {
  return localStorage.getItem('accessToken');
};

export async function createAsignacion(newAsignacion: any) {
  try {
    const token = getToken();
    const response = await fetch(`http://${backendHost}:3000/api/v1/asignacion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAsignacion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la asignación');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error en createAsignacion:', error);
    throw error;
  }
}

export async function updateAsignacion(codigo_asignacion: number, newAsignacion: any) {
  try {
    const token = getToken();
    const response = await fetch(`http://${backendHost}:3000/api/v1/asignacion/${codigo_asignacion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAsignacion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar la asignación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateAsignacion:', error);
    throw error;
  }
}

export async function desactiveAsignacion(codigo_asignacion: number) {
  try {
    const token = getToken(); 
    const response = await fetch(`http://${backendHost}:3000/api/v1/asignacion/${codigo_asignacion}/estado`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Error al desactivar la asignación';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Error parseando el cuerpo de la respuesta:', e);
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      return {}; 
    }
  } catch (error) {
    console.error('Error en desactiveAsignacion:', error);
    throw error;
  }
}
