import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'comando'})

export class Comando{
 
    @PrimaryGeneratedColumn()
    codigo_comando: number;

    @Column()
    estado: boolean;

    @Column({type: 'varchar', length: 100})
    nombre_comando: string;
}