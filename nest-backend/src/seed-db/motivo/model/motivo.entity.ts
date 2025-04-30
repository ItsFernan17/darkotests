import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'motivo'})

export class Motivo{
 
    @PrimaryGeneratedColumn()
    codigo_motivo: number;

    @Column()
    estado: boolean;

    @Column({type: 'varchar', length: 50})
    nombre_motivo: string;
}