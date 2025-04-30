import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRespuestaDto{

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'La respuesta es requerida'})
    @MinLength(5, {message: 'La respuesta debe tener mínimo 5 caracteres'} )
    @MaxLength(100, {message: 'La respuesta debe tener máximo 100 caracteres'})
    respuesta: string;

    @IsBoolean()
    @IsNotEmpty( {message: 'La respuesta es requiere saber si es correcta o no'})
    esCorrecta: boolean;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;
} 