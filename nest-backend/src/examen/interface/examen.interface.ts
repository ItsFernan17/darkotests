
export interface Examen{
    codigo_examen: number;
    estado: boolean;
    fecha_evaluacion: Date;
    tipo_examen: number;
    punteo_maximo: number;
    usuario_ingreso: string;
    fecha_ingreso: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
}