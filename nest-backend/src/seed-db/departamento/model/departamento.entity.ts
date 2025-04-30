import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'departamento_residencia'})

export class Departamento{
 
    @PrimaryGeneratedColumn()
    codigo_departamento: number;

    @Column()
    estado: boolean;

    @Column({type: 'varchar', length: 100})
    nombre_departamento: string;
}