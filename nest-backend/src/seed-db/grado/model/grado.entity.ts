import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'grado'})

export class Grado{
 
    @PrimaryGeneratedColumn()
    codigo_grado: number;

    @Column()
    estado: boolean;

    @Column({type: 'varchar', length: 100})
    nombre_grado: string;
}