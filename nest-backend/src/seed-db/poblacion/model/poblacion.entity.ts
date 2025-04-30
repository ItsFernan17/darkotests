import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'poblacion'})

export class Poblacion{
 
    @PrimaryGeneratedColumn()
    codigo_poblacion: number;

    @Column()
    estado: boolean;

    @Column({type: 'varchar', length: 50})
    nombre_poblacion: string;
}