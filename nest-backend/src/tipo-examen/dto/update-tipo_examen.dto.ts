import { Transform } from "class-transformer";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTipoExamenDto{

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsOptional()
    @MinLength(5, {message: 'El tipo de examen debe tener mínimo 5 caracteres'} )
    @MaxLength(100, {message: 'El tipo de examen debe tener máximo 100 caracteres'})
    descripcion: string;

    @IsString()
    @IsOptional()
    ceom: string;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario modificador debe tener mínimo 4 caracteres" })
    usuario_modifica?: string;
} 