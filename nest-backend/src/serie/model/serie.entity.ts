import { Usuario } from 'src/usuario/model/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('serie')
export class Serie {
    @PrimaryGeneratedColumn()
    codigo_serie: number;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;

    @Column({ type: 'varchar', length: 200 })
    instrucciones: string;

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