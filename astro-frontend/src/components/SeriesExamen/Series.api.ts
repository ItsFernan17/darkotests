import { backendHost } from "../../utils/apiHost";

// Obtener el token de acceso desde localStorage
const getToken = () => {
    return localStorage.getItem('accessToken');
  };
  
  export async function getAsignacionExamen(codigo_serie: number) {
    try {
      const token = getToken();
      const response = await fetch(`${backendHost}/api/v1/serie/${codigo_serie}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token de autorización
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching asignacion examen:', error);
      throw error;
    }
  }
  
  export async function createAsignacionExamen(newAsignacion: any) {
    try {
      const token = getToken();
      const response = await fetch(`${backendHost}/api/v1/serie/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token de autorización
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsignacion),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error creating asignacion examen:', error);
      throw error;
    }
  }
  
  export async function updateAsignacionExamen(codigo_serie: number, updatedAsignacion: any) {
    try {
      const token = getToken();
      const response = await fetch(`${backendHost}/api/v1/serie/${codigo_serie}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token de autorización
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAsignacion),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating asignacion examen:', error);
      throw error;
    }
  }
  
  export async function desactiveAsignacionExamen(codigo_serie: number) {
    try {
      const token = getToken();
      const response = await fetch(`${backendHost}/api/v1/serie/${codigo_serie}/estado`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token de autorización
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deactivating asignacion examen:', error);
      throw error;
    }
  }
  