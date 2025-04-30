import { Pregunta } from 'src/pregunta/model/pregunta.entity';
import { SerieExamen } from 'src/serie-examen/model/serie-examen.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('examen_master')
export class ExamenMaster {
    @PrimaryGeneratedColumn()
    codigo_master: number;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @ManyToOne(() => SerieExamen, { nullable: true })
    @JoinColumn({ name: 'serie_examen' })
    serie_examen: SerieExamen;

    @ManyToOne(() => Pregunta, { nullable: true })
    @JoinColumn({ name: 'pregunta' })
    pregunta: Pregunta;

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