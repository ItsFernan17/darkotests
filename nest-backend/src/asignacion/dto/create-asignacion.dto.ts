import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class CreateAsignacionDto {
    @IsNotEmpty({ message: "El evaluado es obligatorio" })
    @IsString()
    evaluado: string;

    @IsNotEmpty({ message: "El examen es obligatorio" })
    @IsInt({ message: "El examen debe ser un número entero" })
    examen: number;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    usuario_ingreso: string;
}
