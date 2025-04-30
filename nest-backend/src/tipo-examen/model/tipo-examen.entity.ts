import { Empleo } from 'src/empleo/model/empleo.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('tipo_examen')
export class TipoExamen {
    @PrimaryGeneratedColumn()
    codigo_tipoE: number;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @Column({ type: 'varchar', length: 100 })
    description: string;

    @ManyToOne(() => Empleo, { nullable: true })
    @JoinColumn({ name: 'ceom' })
    ceom: Empleo;

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