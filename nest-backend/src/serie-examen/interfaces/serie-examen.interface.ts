
export interface SerieExamen{
    codigo_se_ex: number;
    estado: boolean;
    examen: number;
    serie: number;
    usuario_ingreso: string;
    fecha_ingreso: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
}