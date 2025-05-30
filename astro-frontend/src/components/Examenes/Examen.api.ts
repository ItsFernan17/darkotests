import { backendHost } from "../../utils/apiHost"; 

function getToken() {
    return localStorage.getItem('accessToken'); // Obtener el token del localStorage
  }
  
  export async function createExamen(newExamen: any) {
    try {
      const token = getToken(); // Obtener el token
  
      const response = await fetch(`http://${backendHost}:3000/api/v1/examen-master/crear-examen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Añadir el token en la cabecera
        },
        body: JSON.stringify(newExamen),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error creating examen:', error);
      throw error;
    }
  }
  
  export async function updateExamen(codigo_examen: number, newExamen: any) {
    try {
      const token = getToken(); // Obtener el token
  
      const response = await fetch(`http://${backendHost}:3000/api/v1/examen-master/actualizar/${codigo_examen}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Añadir el token en la cabecera
        },
        body: JSON.stringify(newExamen),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating examen:', error);
      throw error;
    }
  }
  
  export async function desactiveExamen(codigo_examen: number) {
    try {
      const token = getToken(); // Obtener el token
  
      const response = await fetch(`http://${backendHost}:3000/api/v1/examen-master/anular/${codigo_examen}/estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`, // Añadir el token en la cabecera
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deactivating examen:', error);
      throw error;
    }
  }
  