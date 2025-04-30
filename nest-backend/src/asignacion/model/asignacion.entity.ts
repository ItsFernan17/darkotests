import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Examen } from 'src/examen/model/examen.entity';

@Entity({ name: 'asignacion' })
@Entity({ name: 'asignacion' })
export class Asignacion {
  @PrimaryGeneratedColumn()
  codigo_asignacion: number;

  @Column({ type: 'bit', width: 1})
  estado: boolean;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'evaluado' })
  evaluado: Usuario;

  @ManyToOne(() => Examen, { nullable: false })
  @JoinColumn({ name: 'examen' })
  examen: Examen;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_ingreso' })
  usuario_ingreso: Usuario;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  fecha_ingreso: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_modifica: Date;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_modifica' })
  usuario_modifica: Usuario;

  @Column({ nullable: true })
  punteo: number | null;

}