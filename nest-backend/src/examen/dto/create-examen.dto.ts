import { IsDateString, IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateExamenDto {

    @IsDateString()
    @IsNotEmpty({ message: "La fecha de evaluación es obligatoria" })
    fecha_evaluacion: Date;

    @IsNumber()
    @IsNotEmpty({ message: "El tipo de examen es obligatorio" })
    tipo_examen: number;

    
    @IsNumber()
    @IsNotEmpty({ message: "El motivo del examen es obligatorio" })
    motivo_examen: number;

    @IsNumber()
    @IsNotEmpty({ message: "El punteo máximo es obligatorio" })
    punteo_maximo: number;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;
}