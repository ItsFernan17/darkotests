export interface Empleo {
    codigo_pregunta: number;
    estado: boolean;
    descripcion: string;
    punteo: number;
    tipo_pregunta: number;
    usuario_ingreso: string;
    fecha_ingreso: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
}