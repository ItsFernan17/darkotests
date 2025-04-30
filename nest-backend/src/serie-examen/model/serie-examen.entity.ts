import { Examen } from 'src/examen/model/examen.entity';
import { Serie } from 'src/serie/model/serie.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('serie_examen')
export class SerieExamen {
    @PrimaryGeneratedColumn()
    codigo_se_ex: number;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @ManyToOne(() => Examen, { nullable: true })
    @JoinColumn({ name: 'examen' })
    examen: Examen;

    @ManyToOne(() => Serie, { nullable: true })
    @JoinColumn({ name: 'serie' })
    serie: Serie;

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