export interface Respuesta {
    codigo_respuesta: number;
    estado: boolean;
    respuesta: string;
    esCorrecta: boolean;
    usuario_ingreso: string;
    fecha_ingreso: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
}