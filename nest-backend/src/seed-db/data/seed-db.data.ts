

interface SeedDepartamentos {
  codigo_departamento: number;
  estado: boolean;
  nombre_departamento: string;
}

interface SeedPoblacion {
  codigo_poblacion: number;
  estado: boolean;
  nombre_poblacion: string;
}

interface SeedGrado {
  codigo_grado: number;
  estado: boolean;
  nombre_grado: string;
}

interface SeedMotivo{
  codigo_motivo: number;
  estado: boolean;
  nombre_motivo: string;
}

interface SeedComando{
  codigo_comando: number;
  estado: boolean;
  nombre_comando: string;
}

interface SeedUser{
  dpi: string;
  estado: boolean;
  nombre_completo: string;
  telefono: string;
  nombre_usuario: string;
  contrasenia: string;
  rol: string;
  grado: number;
  poblacion: number;
  residencia: number;
  comando: number;
}

interface TipoPreguntaData{
  codigo_tipo_pregunta: number;
  estado: boolean;
  descripcion: string;
}

interface SeedData {
  departamentos: SeedDepartamentos[];
  poblacion: SeedPoblacion[];
  grado: SeedGrado[];
  motivo: SeedMotivo[];
  comando: SeedComando[];
  usuario: SeedUser[];
  tipo_pregunta: TipoPreguntaData[];
}


export const initialData: SeedData = {
  departamentos: [
    {
      codigo_departamento: 15,
      estado: true,
      nombre_departamento: 'Alta Verapaz'
    },
    {
      codigo_departamento: 14,
      estado: true,
      nombre_departamento: 'Baja Verapaz'
    },
    {
      codigo_departamento: 3,
      estado: true,
      nombre_departamento: 'Chimaltenango'
    },
    {
      codigo_departamento: 19,
      estado: true,
      nombre_departamento: 'Chiquimula'
    },
    {
      codigo_departamento: 4,
      estado: true,
      nombre_departamento: 'Escuintla'
    },
    {
      codigo_departamento: 22,
      estado: true,
      nombre_departamento: 'El Progreso'
    },
    {
      codigo_departamento: 1,
      estado: true,
      nombre_departamento: 'Guatemala'
    },
    {
      codigo_departamento: 12,
      estado: true,
      nombre_departamento: 'Huehuetenango'
    },
    {
      codigo_departamento: 21,
      estado: true,
      nombre_departamento: 'Jalapa'
    },
    {
      codigo_departamento: 20,
      estado: true,
      nombre_departamento: 'Jutiapa'
    },
    {
      codigo_departamento: 16,
      estado: true,
      nombre_departamento: 'Izabal'
    },
    {
      codigo_departamento: 17,
      estado: true,
      nombre_departamento: 'Peten'
    },
    {
      codigo_departamento: 13,
      estado: true,
      nombre_departamento: 'Quiché'
    },
    {
      codigo_departamento: 8,
      estado: true,
      nombre_departamento: 'Quetzaltenango'
    },
    {
      codigo_departamento: 5,
      estado: true,
      nombre_departamento: 'Santa Rosa'
    },
    {
      codigo_departamento: 6,
      estado: true,
      nombre_departamento: 'Sololá'
    },
    {
      codigo_departamento: 9,
      estado: true,
      nombre_departamento: 'Suchitepéquez'
    },
    {
      codigo_departamento: 11,
      estado: true,
      nombre_departamento: 'San Marcos'
    },
    {
      codigo_departamento: 10,
      estado: true,
      nombre_departamento: 'Retalhuleu'
    },
    {
      codigo_departamento: 7,
      estado: true,
      nombre_departamento: 'Totonicapán'
    },
    {
      codigo_departamento: 18,
      estado: true,
      nombre_departamento: 'Zacapa'
    }
  ],

  poblacion: [
    {
      codigo_poblacion: 1,
      estado: true,
      nombre_poblacion: 'Civiles'
    },
    {
      codigo_poblacion: 4,
      estado: true,
      nombre_poblacion: 'Especialistas'
    },
    {
      codigo_poblacion: 5,
      estado: true,
      nombre_poblacion: 'Oficiales Asimilados'
    },
    {
      codigo_poblacion: 6,
      estado: true,
      nombre_poblacion: 'Oficiales de Carrera'
    },
    {
      codigo_poblacion: 2,
      estado: true,
      nombre_poblacion: 'Planilleros'
    },
    {
      codigo_poblacion: 3,
      estado: true,
      nombre_poblacion: 'Tropas'
    }
  ],
  grado: [
    {
      codigo_grado: 1,
      estado: true,
      nombre_grado: 'Civil'
    },
    {
      codigo_grado: 2,
      estado: true,
      nombre_grado: 'Soldado de Segunda'
    },
    {
      codigo_grado: 3,
      estado: true,
      nombre_grado: 'Soldado de Primera'
    },
    {
      codigo_grado: 4,
      estado: true,
      nombre_grado: 'Subteniente'
    },
    {
      codigo_grado: 5,
      estado: true,
      nombre_grado: 'Planillero'
    },
    {
      codigo_grado: 6,
      estado: true,
      nombre_grado: 'Cabo'
    },
    {
      codigo_grado: 7,
      estado: true,
      nombre_grado: 'Sargento Segundo'
    },
    {
      codigo_grado: 8,
      estado: true,
      nombre_grado: 'Sargento Mayor'
    },
    {
      codigo_grado: 9,
      estado: true,
      nombre_grado: 'Sargento Mayor Comandante de Pelotón'
    },
    {
      codigo_grado: 10,
      estado: true,
      nombre_grado: 'Sargento Primero'
    },
    {
      codigo_grado: 11,
      estado: true,
      nombre_grado: 'Sargento Técnico'
    },
    {
      codigo_grado: 12,
      estado: true,
      nombre_grado: 'Marinero de Tercera'
    },
    {
      codigo_grado: 13,
      estado: true,
      nombre_grado: 'Marinero de Segunda'
    },
    {
      codigo_grado: 14,
      estado: true,
      nombre_grado: 'Marinero de Primera'
    },
    {
      codigo_grado: 15,
      estado: true,
      nombre_grado: 'Maestre Técnico'
    },
    {
      codigo_grado: 16,
      estado: true,
      nombre_grado: 'Maestre Especialista'
    },
    {
      codigo_grado: 17,
      estado: true,
      nombre_grado: 'Maestre Mayor'
    },
    {
      codigo_grado: 18,
      estado: true,
      nombre_grado: 'Teniente Coronel'
    },
    {
      codigo_grado: 19,
      estado: true,
      nombre_grado: 'Teniente de Navío'
    },
    {
      codigo_grado: 20,
      estado: true,
      nombre_grado: 'Teniente de Fragata'
    },
    {
      codigo_grado: 21,
      estado: true,
      nombre_grado: 'Capitán Segundo'
    },
    {
      codigo_grado: 22,
      estado: true,
      nombre_grado: 'Vicealmirante'
    },
    {
      codigo_grado: 23,
      estado: true,
      nombre_grado: 'Contramaestre'
    },
    {
      codigo_grado: 24,
      estado: true,
      nombre_grado: 'Almirante'
    },
    {
      codigo_grado: 25,
      estado: true,
      nombre_grado: 'Alférez de Fragata'
    },
    {
      codigo_grado: 26,
      estado: true,
      nombre_grado: 'Alférez de Navío'
    },
    {
      codigo_grado: 27,
      estado: true,
      nombre_grado: 'Capitán de Fragata'
    },
    {
      codigo_grado: 28,
      estado: true,
      nombre_grado: 'Capitán de Corbeta'
    },
    {
      codigo_grado: 29,
      estado: true,
      nombre_grado: 'Capitán Primero'
    },
    {
      codigo_grado: 30,
      estado: true,
      nombre_grado: 'Mayor'
    },
    {
      codigo_grado: 31,
      estado: true,
      nombre_grado: 'General de Brigada'
    },
    {
      codigo_grado: 32,
      estado: true,
      nombre_grado: 'Coronel'
    },
    {
      codigo_grado: 33,
      estado: true,
      nombre_grado: 'General de División'
    }
  ],
  motivo: [
    {
      "codigo_motivo": 101,
      "estado": true,
      "nombre_motivo": "Ingreso a la Institución"
    },
    {
      "codigo_motivo": 102,
      "estado": true,
      "nombre_motivo": "Promoción Laboral"
    },
    {
      "codigo_motivo": 103,
      "estado": true,
      "nombre_motivo": "Cambio de Puesto"
    },
    {
      "codigo_motivo": 104,
      "estado": true,
      "nombre_motivo": "Capacitación Especializada A"
    },
    {
      "codigo_motivo": 105,
      "estado": true,
      "nombre_motivo": "Capacitación Especializada B"
    },
    {
      "codigo_motivo": 106,
      "estado": true,
      "nombre_motivo": "Curso de Formación Profesional"
    },
    {
      "codigo_motivo": 107,
      "estado": true,
      "nombre_motivo": "Entrenamiento de Alta Exigencia"
    },
    {
      "codigo_motivo": 108,
      "estado": true,
      "nombre_motivo": "Curso de Liderazgo"
    },
    {
      "codigo_motivo": 109,
      "estado": true,
      "nombre_motivo": "Curso de Nivel Avanzado"
    },
    {
      "codigo_motivo": 110,
      "estado": true,
      "nombre_motivo": "Retiro o Baja de la Institución"
    },
    {
      "codigo_motivo": 201,
      "estado": true,
      "nombre_motivo": "Evaluación Técnica"
    },
    {
      "codigo_motivo": 202,
      "estado": true,
      "nombre_motivo": "Evaluación Psicológica"
    },
    {
      "codigo_motivo": 203,
      "estado": true,
      "nombre_motivo": "Evaluación Médica"
    },
    {
      "codigo_motivo": 204,
      "estado": true,
      "nombre_motivo": "Técnica y Psicológica"
    },
    {
      "codigo_motivo": 205,
      "estado": true,
      "nombre_motivo": "Técnica y Médica"
    },
    {
      "codigo_motivo": 206,
      "estado": true,
      "nombre_motivo": "Psicológica y Técnica"
    },
    {
      "codigo_motivo": 207,
      "estado": true,
      "nombre_motivo": "Psicológica y Médica"
    },
    {
      "codigo_motivo": 208,
      "estado": true,
      "nombre_motivo": "Técnica, Psicológica y Médica"
    },
    {
      "codigo_motivo": 209,
      "estado": true,
      "nombre_motivo": "Documento Falsificado"
    },
    {
      "codigo_motivo": 210,
      "estado": true,
      "nombre_motivo": "No Aplica"
    }
  ],  
  comando: [
    {
      codigo_comando: 1,
      estado: true,
      nombre_comando: 'Auditoría Militar de Cuentas'
    },
    {
      codigo_comando: 2,
      estado: true,
      nombre_comando: 'Brigada de Operaciones para Montaña'
    },
    {
      codigo_comando: 3,
      estado: true,
      nombre_comando: 'Brigada de Fuerzas Especiales GBPNH'
    },
    {
      codigo_comando: 4,
      estado: true,
      nombre_comando: 'Brigada de Infantería de Marina'
    },
    {
      codigo_comando: 5,
      estado: true,
      nombre_comando: 'Brigada de Paracaidistas G.F.C.'
    },
    {
      codigo_comando: 6,
      estado: true,
      nombre_comando: 'Brigada Especial de Operaciones de Selva TCIVAQA'
    },
    {
      codigo_comando: 7,
      estado: true,
      nombre_comando: 'Brigada Humanitaria y de Rescate CFAC'
    },
    {
      codigo_comando: 8,
      estado: true,
      nombre_comando: 'Brigada Militar Mariscal Zavala'
    },
    {
      codigo_comando: 9,
      estado: true,
      nombre_comando: 'Centro de Adiestramiento del Ejército de Guatemala'
    },
    {
      codigo_comando: 10,
      estado: true,
      nombre_comando: 'Centro de Atención a Discapacitados del Ejército de Guatemala'
    },
    {
      codigo_comando: 11,
      estado: true,
      nombre_comando: 'Centro de las Fuerzas Armadas Centroamericanas'
    },
    {
      codigo_comando: 12,
      estado: true,
      nombre_comando: 'Centro Médico Militar'
    },
    {
      codigo_comando: 13,
      estado: true,
      nombre_comando: 'Comandancia Fuerza Aérea Guatemalteca'
    },
    {
      codigo_comando: 14,
      estado: true,
      nombre_comando: 'Comandancia Marina Defensa Nacional'
    },
    {
      codigo_comando: 15,
      estado: true,
      nombre_comando: 'Comando Aéreo Central La Aurora'
    },
    {
      codigo_comando: 16,
      estado: true,
      nombre_comando: 'Comando Aéreo del Norte TCDEHS, Petén'
    },
    {
      codigo_comando: 17,
      estado: true,
      nombre_comando: 'Comando Aéreo del Sur CMEVM, Retalhuleu'
    },
    {
      codigo_comando: 18,
      estado: true,
      nombre_comando: 'Comando de Apoyo Logístico'
    },
    {
      codigo_comando: 19,
      estado: true,
      nombre_comando: 'Comando de Comunicaciones del Ejército'
    },
    {
      codigo_comando: 20,
      estado: true,
      nombre_comando: 'Comando de Fuerza Especial Naval'
    },
    {
      codigo_comando: 21,
      estado: true,
      nombre_comando: 'Comando de Informática y Tecnología'
    },
    {
      codigo_comando: 22,
      estado: true,
      nombre_comando: 'Comando Naval del Pacífico, Escuintla'
    },
    {
      codigo_comando: 23,
      estado: true,
      nombre_comando: 'Comando Regional de Entrenamiento de Operaciones de Mantenimiento de Paz'
    },
    {
      codigo_comando: 24,
      estado: true,
      nombre_comando: 'Comando Superior de Educación del Ejército'
    },
    {
      codigo_comando: 25,
      estado: true,
      nombre_comando: 'Cuarta Brigada Infantería G.J.R.B.'
    },
    {
      codigo_comando: 26,
      estado: true,
      nombre_comando: 'Cuerpo de Ingenieros del Ejército T.C.E I. F.V.A'
    },
    {
      codigo_comando: 27,
      estado: true,
      nombre_comando: 'Cuerpo de Transporte del Ejército de Guatemala'
    },
    {
      codigo_comando: 28,
      estado: true,
      nombre_comando: 'Dirección General de Derechos Humanos MDN'
    },
    {
      codigo_comando: 29,
      estado: true,
      nombre_comando: 'Dirección de Inteligencia del EMDN'
    },
    {
      codigo_comando: 30,
      estado: true,
      nombre_comando: 'Dirección de Logística del EMDN'
    },
    {
      codigo_comando: 31,
      estado: true,
      nombre_comando: 'Dirección de Operaciones de Paz del EMDN'
    },
    {
      codigo_comando: 32,
      estado: true,
      nombre_comando: 'Dirección de Operaciones del EMDN'
    },
    {
      codigo_comando: 33, 
      estado: true,
      nombre_comando: 'Dirección de Personal del EMDN'
    },
    {
      codigo_comando: 34,
      estado: true,
      nombre_comando: 'Dirección de Planificación Estratégica del EMDN'
    },
    {
      codigo_comando: 35,
      estado: true,
      nombre_comando: 'Dirección General Administrativa del EMDN'
    },
    {
      codigo_comando: 36,
      estado: true,
      nombre_comando: 'Dirección General Administrativa del MDN'
    },
    {
      codigo_comando: 37,
      estado: true,
      nombre_comando: 'Dirección General de Asuntos Jurídicos MDN'
    },
    {
      codigo_comando: 38,
      estado: true,
      nombre_comando: 'Dirección General de Asuntos Marítimos del MDN'
    },
    {
      codigo_comando: 39,
      estado: true,
      nombre_comando: 'Dirección General de Capitanías de Puertos del MDN'
    },
    {
      codigo_comando: 40,
      estado: true,
      nombre_comando: 'Dirección General de Compras y Adquisiciones del MDN'
    },
    {
      codigo_comando: 41,
      estado: true,
      nombre_comando: 'Dirección General de Control de Armas y Municiones del MDN'
    },
    {
      codigo_comando: 42,
      estado: true,
      nombre_comando: 'Dirección General de Deportes y Recreación del MDN'
    },
    {
      codigo_comando: 43,
      estado: true,
      nombre_comando: 'Dirección General de Especies Estancadas MDN'
    },
    {
      codigo_comando: 44,
      estado: true,
      nombre_comando: 'Dirección General de Finanzas del MDN'
    },
    {
      codigo_comando: 45,
      estado: true,
      nombre_comando: 'Dirección General de Política de Defensa del MDN'
    },
    {
      codigo_comando: 46,
      estado: true,
      nombre_comando: 'Dirección General de Prensa del MDN'
    },
    {
      codigo_comando: 47,
      estado: true,
      nombre_comando: 'Dirección General Integral de Gestión del MDN'
    },
    {
      codigo_comando: 48,
      estado: true,
      nombre_comando: 'Dirección Relaciones Civiles Militares EMDN'
    },
    {
      codigo_comando: 49,
      estado: true,
      nombre_comando: 'Escuela Militar de Aviación'
    },
    {
      codigo_comando: 50,
      estado: true,
      nombre_comando: 'Escuela Naval de Guatemala'
    },
    {
      codigo_comando: 51,
      estado: true,
      nombre_comando: 'Escuela Politécnica'
    },
    {
      codigo_comando: 52,
      estado: true,
      nombre_comando: 'Escuela Técnica Militar de Aviación'
    },
    {
      codigo_comando: 53,
      estado: true,
      nombre_comando: 'Estado Mayor Personal del M.D.N.'
    },
    {
      codigo_comando: 54,
      estado: true,
      nombre_comando: 'Estado Mayor Personal del JEMDN.'
    },
    {
      codigo_comando: 55,
      estado: true,
      nombre_comando: 'Estado Mayor Personal del SUBJEMDN.'
    },
    {
      codigo_comando: 56,
      estado: true,
      nombre_comando: 'Estado Mayor Personal del Vice M.D.N.'
    },
    {
      codigo_comando: 57,
      estado: true,
      nombre_comando: 'Estado Mayor Personal del Vice Marina.D.N.'
    },
    {
      codigo_comando: 58,
      estado: true,
      nombre_comando: 'Fábrica de Municiones del Ejército'
    },
    {
      codigo_comando: 59,
      estado: true,
      nombre_comando: 'Guardia Presidencial'
    },
    {
      codigo_comando: 60,
      estado: true,
      nombre_comando: 'Hospital de la Fuerza Aérea Guatemalteca NSVL'
    },
    {
      codigo_comando: 61,
      estado: true,
      nombre_comando: 'Industria Militar del Ejército'
    },
    {
      codigo_comando: 62,
      estado: true,
      nombre_comando: 'Inspectoría General de las Fuerzas Armadas'
    },
    {
      codigo_comando: 63,
      estado: true,
      nombre_comando: 'Inspectoría General de Medicina Militar'
    },
    {
      codigo_comando: 64,
      estado: true,
      nombre_comando: 'Inspectoría General del Ejército de Guatemala'
    },
    {
      codigo_comando: 65,
      estado: true,
      nombre_comando: 'Inspectoría General del MDN'
    },
    {
      codigo_comando: 66,
      estado: true,
      nombre_comando: 'Ministerio de la Defensa Nacional'
    },
    {
      codigo_comando: 67,
      estado: true,
      nombre_comando: 'Parque de Material de Guerra del Ejército'
    },
    {
      codigo_comando: 68,
      estado: true,
      nombre_comando: 'Primera Brigada de Infantería G.M.A'
    },
    {
      codigo_comando: 69,
      estado: true,
      nombre_comando: 'Primera Brigada de la Policía Militar Guardia de Honor'
    },
    {
      codigo_comando: 70,
      estado: true,
      nombre_comando: 'Secretaría de Asuntos Administrativos del M.D.N'
    },
    {
      codigo_comando: 71,
      estado: true,
      nombre_comando: 'Secretaría de Asuntos de Género del MDN'
    },
    {
      codigo_comando: 72,
      estado: true,
      nombre_comando: 'Secretaría de Coordinación del M.D.N'
    },
    {
      codigo_comando: 73,
      estado: true,
      nombre_comando: 'Secretaría de la Jefatura del Estado Mayor de la Defensa Nacional'
    },
    {
      codigo_comando: 74,
      estado: true,
      nombre_comando: 'Segunda Brigada de Infantería G.L.D'
    },
    {
      codigo_comando: 75,
      estado: true,
      nombre_comando: 'Tercera Brigada de Infantería G.E.T.B'
    },
    {
      codigo_comando: 76,
      estado: true,
      nombre_comando: 'Unidad de Control de Reservas Militares del Ejército'
    },
    {
      codigo_comando: 77,
      estado: true,
      nombre_comando: 'Unidad de Control de Reservas Militares MDN'
    },
    {
      codigo_comando: 78,
      estado: true,
      nombre_comando: 'Unidad de Desastres Naturales del Ejército'
    },
    {
      codigo_comando: 79,
      estado: true,
      nombre_comando: 'Unidad de Desminado Humanitario del Ejército'
    },
    {
      codigo_comando: 80,
      estado: true,
      nombre_comando: 'Unidad de Derechos Humanos del Ejército'
    },
    {
      codigo_comando: 81,
      estado: true,
      nombre_comando: 'Unidad de Mantenimiento de Paz del Ejército'
    },
    {
      codigo_comando: 82,
      estado: true,
      nombre_comando: 'Unidad de Seguridad de Fronteras del Ejército'
    },
    {
      codigo_comando: 83,
      estado: true,
      nombre_comando: 'Unidad Humanitaria y de Rescate MDN'
    },
    {
      codigo_comando: 84,
      estado: true,
      nombre_comando: 'Unidad Médica del Ejército de Guatemala'
    },
    {
      codigo_comando: 85,
      estado: true,
      nombre_comando: 'Unidad Militar de Apoyo a Emergencias MDN'
    },
    {
      codigo_comando: 86,
      estado: true,
      nombre_comando: 'Unidad Naval del Ejército'
    },
    {
      codigo_comando: 87,
      estado: true,
      nombre_comando: 'Unidad de Seguridad Presidencial'
    },
    {
      codigo_comando: 88,
      estado: true,
      nombre_comando: 'Unidad de Inteligencia Militar'
    },
    {
      codigo_comando: 89,
      estado: true,
      nombre_comando: 'Zona Militar de Reservas'
    }
  ], 
  usuario:[
    {
      dpi: "1724271260706",
      estado: true,
      nombre_completo: "Alvaro Pur",
      telefono: "5112-5144",
      nombre_usuario: "apurg",
      contrasenia: 'Huevo123',
      rol: 'admin',
      grado: 8,
      poblacion: 4,
      residencia: 12,
      comando: 33
    }
  ],
  tipo_pregunta: [
    {
      "codigo_tipo_pregunta": 1,
      "estado": true,
      "descripcion": "Verdadero o Falso"
    },
    {
      "codigo_tipo_pregunta": 2,
      "estado": true,
      "descripcion": "Ortografía y Separación de Palabras"
    },
    {
      "codigo_tipo_pregunta": 3,
      "estado": true,
      "descripcion": "Identificación de Abreviaturas"
    },
    {
      "codigo_tipo_pregunta": 4,
      "estado": true,
      "descripcion": "Selección Múltiple"
    },
    {
      "codigo_tipo_pregunta": 5,
      "estado": true,
      "descripcion": "Preguntas Abiertas"
    },
    {
      "codigo_tipo_pregunta": 6,
      "estado": true,
      "descripcion": "Análisis de Documento o Archivo"
    },
    {
      "codigo_tipo_pregunta": 7,
      "estado": true,
      "descripcion": "Resolución de Casos o Análisis Crítico"
    },
    {
      "codigo_tipo_pregunta": 8,
      "estado": true,
      "descripcion": "Razonamiento Lógico"
    },
    {
      "codigo_tipo_pregunta": 9,
      "estado": true,
      "descripcion": "Problemas de Geometría"
    },
    {
      "codigo_tipo_pregunta": 10,
      "estado": true,
      "descripcion": "Otro Tipo de Pregunta"
    }
  ]  
};
