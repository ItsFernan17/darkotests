import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from '../../usuario/model/usuario.entity';
import { TipoPregunta } from "src/seed-db/tipo-pregunta/model/tipo-pregunta.entity";

@Entity({ name: 'pregunta' })
export class Pregunta {

    @PrimaryGeneratedColumn()
    codigo_pregunta: number;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @Column({ type: 'varchar', length: 200 })
    descripcion: string;

    @Column({ type: 'decimal', precision: 9, scale: 2 })
    punteo: number;

    @ManyToOne(() => TipoPregunta, { nullable: true })
    @JoinColumn({ name: 'tipo_pregunta' })
    tipo_pregunta: TipoPregunta;

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
