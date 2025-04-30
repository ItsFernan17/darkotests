
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tipo_pregunta'})

export class TipoPregunta{
 
    @PrimaryGeneratedColumn()
    codigo_tipoP: number;

    @Column()
    estado: boolean;

    @Column({type: 'varchar', length: 50})
    descripcion: string;
}