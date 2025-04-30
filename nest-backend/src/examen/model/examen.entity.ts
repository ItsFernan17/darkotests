import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from '../../usuario/model/usuario.entity';
import { TipoExamen } from "src/tipo-examen/model/tipo-examen.entity";
import { Motivo } from "src/seed-db/motivo/model/motivo.entity";

@Entity({ name: 'examen' })
export class Examen {

    @PrimaryGeneratedColumn()
    codigo_examen: number;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @Column({ type: 'date' })
    fecha_evaluacion: Date;

    @ManyToOne(() => TipoExamen, { nullable: true })
    @JoinColumn({ name: 'tipo_examen' })
    tipo_examen: TipoExamen;

    @ManyToOne(() => Motivo, { nullable: true })
    @JoinColumn({ name: 'motivo_examen' })
    motivo_examen: Motivo;

    @Column({ type: 'int' })
    punteo_maximo: number;

    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'usuario_ingreso' })
    usuario_ingreso: Usuario;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    fecha_ingreso: Date;

    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'usuario_modifica' })
    usuario_modifica: Usuario;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    fecha_modifica: Date;
}
