import { IsString, MinLength, IsOptional } from "class-validator";

export class UpdateEmpleoDto {

    @IsString()
    @IsOptional()
    @MinLength(5, { message: "La descripción debe tener mínimo 5 caracteres" })
    descripcion?: string;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario modificador debe tener mínimo 4 caracteres" })
    usuario_modifica?: string;
}
