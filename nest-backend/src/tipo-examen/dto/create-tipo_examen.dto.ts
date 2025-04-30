import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTipoExamenDto{

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'El tipo de examen es requerido'})
    @MinLength(5, {message: 'El tipo de examen debe tener mínimo 5 caracteres'} )
    @MaxLength(100, {message: 'El tipo de examen debe tener máximo 100 caracteres'})
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: "El ceom es obligatorio" })
    ceom: string;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;
} 