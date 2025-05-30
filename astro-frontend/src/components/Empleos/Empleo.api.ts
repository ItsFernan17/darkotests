import { backendHost } from "../../utils/apiHost"; 

function getToken() {
    return localStorage.getItem("accessToken");
  }
  
  export async function getEmpleoCEOM(ceom: string) {
    try {
      const token = getToken(); // Obtener el token de localStorage
  
      const response = await fetch(`http://${backendHost}:3000/api/v1/empleo/${ceom}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Agregar token en el encabezado
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching empleo:', error);
      throw error;
    }
  }
  
  export async function createEmpleo(newEmpleo: any) {
    try {
      const token = getToken(); // Obtener el token de localStorage
  
      const response = await fetch(`http://${backendHost}:3000/api/v1/empleo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Agregar token en el encabezado
        },
        body: JSON.stringify(newEmpleo)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error creating empleo:', error);
      throw error;
    }
  }
  
  export async function updateEmpleo(ceom: string, newEmpleo: any) {
    try {
      const token = getToken(); // Obtener el token de localStorage
  
      const response = await fetch(`http://${backendHost}:3000/api/v1/empleo/${ceom}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Agregar token en el encabezado
        },
        body: JSON.stringify(newEmpleo)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating empleo:', error);
      throw error;
    }
  }
  
  export async function desactiveEmpleo(ceom: string) {
    try {
      const token = getToken(); // Obtener el token de localStorage
  
      const response = await fetch(`http://${backendHost}:3000/api/v1/empleo/${ceom}/estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}` // Agregar token en el encabezado
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deactivating empleo:', error);
      throw error;
    }
  }
  