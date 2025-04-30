
import { Role } from "../../common/enums/rol.enum";
import { Comando } from "src/seed-db/comando/model/comando.entity";
import { Departamento } from "src/seed-db/departamento/model/departamento.entity";
import { Grado } from "src/seed-db/grado/model/grado.entity";
import { Poblacion } from "src/seed-db/poblacion/model/poblacion.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";

@Entity()
export class Usuario {

    @PrimaryColumn({unique: true})
    dpi: string;

    @Column({ type: 'bit', width: 1 })
    estado: boolean;

    @Column({ length: 75 })
    nombre_completo: string;

    @Column({ unique: true })
    telefono: string;

    @Column({ unique: true, nullable: false })
    nombre_usuario: string;

    @Column({ type: 'enum', enum: Role, default: Role.EVALUADO })
    rol: string;    

    @Column({ length: 100, nullable: false, select: false })
    password: string;

    @ManyToOne(() => Grado, { nullable: true })
    @JoinColumn({ name: 'grado' })
    grado: Grado;

    @ManyToOne(() => Poblacion, { nullable: true })
    @JoinColumn({ name: 'poblacion' })
    poblacion: Poblacion;

    @ManyToOne(() => Departamento, { nullable: true })
    @JoinColumn({ name: 'residencia' })
    residencia: Departamento;  

    @ManyToOne(() => Comando, { nullable: true })
    @JoinColumn({ name: 'comando' })
    comando: Comando; 
}
