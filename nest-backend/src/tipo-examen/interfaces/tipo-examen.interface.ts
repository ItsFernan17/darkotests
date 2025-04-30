export interface TipoExamen {
    codigo_tipoE: number;
    estado: boolean;
    description: string;
    ceom: string;
    usuario_ingreso: string;
    fecha_ingreso: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
}