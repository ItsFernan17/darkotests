import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateSerieExamenDto{

    @IsNotEmpty( { message: 'El examen es obligatorio' } )
    @IsNumber()
    examen: number;

    @IsNotEmpty( { message: 'La serie es obligatoria' } )
    @IsNumber()
    serie: number;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;

}