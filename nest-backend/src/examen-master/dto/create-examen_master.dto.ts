import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateExamenMasterDto{

    @IsNotEmpty({message: 'La serie de examen es requerida'})
    @IsNumber()
    serie_examen: number;

    @IsNotEmpty({message: 'La pregunta es requerida'})
    @IsNumber()
    pregunta: number;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;

}