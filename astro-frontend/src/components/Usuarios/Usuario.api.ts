import { backendHost } from "../../utils/apiHost"; 

// Función para obtener el token de localStorage
function getToken() {
  return localStorage.getItem("accessToken");
}

export async function getUsuarioDpi(dpi: string) {
  try {
    const token = getToken(); // Obtener el token

    const response = await fetch(`${backendHost}/api/v1/usuario/${dpi}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Agregar token en el encabezado
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching usuario:", error);
    throw error;
  }
}

export async function createUsuario(newUsuario: any) {
  try {
    const token = getToken();

    const response = await fetch(`${backendHost}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newUsuario)
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'Error desconocido';
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating usuario:', error);
    throw error;
  }
}

export async function updateUsuario(dpi: string, newUsuario: any) {
  try {
    const token = getToken(); // Obtener el token

    const response = await fetch(`${backendHost}/api/v1/usuario/${dpi}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` // Agregar token en el encabezado
      },
      body: JSON.stringify(newUsuario),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating usuario:", error);
    throw error;
  }
}

export async function desactiveUsuario(dpi: string) {
  try {
    const token = getToken(); 

    const response = await fetch(`${backendHost}/api/v1/usuario/${dpi}/estado`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deactivating usuario:", error);
    throw error;
  }
}
