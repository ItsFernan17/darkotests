import { Transform } from "class-transformer";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateSerieDto{

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsOptional()
    @MinLength(1, {message: 'La serie del examen debe tener mínimo 1 caracteres'} )
    @MaxLength(50, {message: 'La serie del examen debe tener máximo 100 caracteres'})
    nombre: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsOptional()
    @MinLength(5, {message: 'La instruccion de la seriedebe tener mínimo 5 caracteres'} )
    @MaxLength(200, {message: 'La instruccion de la serie debe tener máximo 200 caracteres'})
    instrucciones: string;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario modificador debe tener mínimo 4 caracteres" })
    usuario_modifica?: string;
} 