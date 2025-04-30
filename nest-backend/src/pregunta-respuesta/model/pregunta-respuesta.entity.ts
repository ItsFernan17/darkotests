import { Pregunta } from 'src/pregunta/model/pregunta.entity';
import { Respuesta } from 'src/respuesta/model/respuesta.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('pregunta_respuesta')
export class PreguntaRespuesta {
    @PrimaryGeneratedColumn()
    codigo_pre_res: number;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @ManyToOne(() => Pregunta, { nullable: true })
    @JoinColumn({ name: 'pregunta' })
    pregunta: Pregunta;

    @ManyToOne(() => Respuesta, { nullable: true })
    @JoinColumn({ name: 'respuesta' })
    respuesta: Respuesta;

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