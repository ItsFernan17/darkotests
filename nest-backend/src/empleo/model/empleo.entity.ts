import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from '../../usuario/model/usuario.entity';

@Entity({ name: 'empleo' })
export class Empleo {

    @PrimaryColumn({ type: 'varchar', length: 10, unique: true })
    ceom: string;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @Column({ type: 'varchar', length: 100 })
    descripcion: string;

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
