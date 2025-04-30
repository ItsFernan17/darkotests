export interface Serie {
    codigo_serie: number;
    estado: boolean;
    nombre: string;
    instrucciones: string;
    usuario_ingreso: string;
    fecha_ingreso: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
}