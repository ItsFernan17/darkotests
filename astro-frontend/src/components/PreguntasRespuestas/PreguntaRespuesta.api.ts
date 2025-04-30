// Función para obtener el token desde el localStorage
function getToken() {
    return localStorage.getItem('accessToken'); // Obtener el token almacenado en localStorage
}

export async function getEmpleoCEOM(id: number) {
    const token = getToken(); // Obtener el token

    const response = await fetch(`http://localhost:3000/api/v1/pregunta-respuesta/registrar-pregunta/preguntas/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
            'Content-Type': 'application/json' // Especificar el tipo de contenido
        }
    });

    return await response.json();
}

export async function createPregunta(newPregunta: any) {
    const token = getToken(); // Obtener el token

    const response = await fetch('http://localhost:3000/api/v1/pregunta-respuesta/registrar-pregunta', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPregunta)
    });

    const data = await response.json();
    console.log(data);
}

export async function updatePregunta(id: number, newPregunta: any) {
    const token = getToken(); // Obtener el token

    const response = await fetch(`http://localhost:3000/api/v1/pregunta-respuesta/actualizar-pregunta/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPregunta)
    });

    return await response.json();
}

export async function desactivePreguntaRespuesta(codigo_pregunta: number) {
    const token = getToken(); // Obtener el token

    const res = await fetch(`http://localhost:3000/api/v1/pregunta-respuesta/pregunta/${codigo_pregunta}/estado`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
            'Content-Type': 'application/json'
        }
    });

    return await res.json();
}
