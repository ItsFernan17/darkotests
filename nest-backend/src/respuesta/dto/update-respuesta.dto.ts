import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateRespuestaDto{

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsOptional()
    @MinLength(5, {message: 'La respuesta debe tener mínimo 5 caracteres'} )
    @MaxLength(100, {message: 'La respuesta debe tener máximo 100 caracteres'})
    respuesta: string;

    @IsBoolean()
    @IsOptional()
    esCorrecta: boolean;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario modificador debe tener mínimo 4 caracteres" })
    usuario_modifica?: string;
} 