
export interface PreguntaRespuesta{
    codigo_pre_res: number;
    estado: boolean;
    pregunta: number;
    respuesta: number;
    usuario_ingreso: string;
    fecha_ingreso: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
}