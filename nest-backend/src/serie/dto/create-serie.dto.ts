import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSerieDto{

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'La serie del examen es requerida'})
    @MinLength(1, {message: 'La serie del examen debe tener mínimo 1 caracteres'} )
    @MaxLength(50, {message: 'La serie del examen debe tener máximo 100 caracteres'})
    nombre: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'La instruccion de la serie es requerida'})
    @MinLength(5, {message: 'La instruccion de la serie debe tener mínimo 5 caracteres'} )
    @MaxLength(200, {message: 'La instruccion de la serie debe tener máximo 200 caracteres'})
    instrucciones: string;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;
} 