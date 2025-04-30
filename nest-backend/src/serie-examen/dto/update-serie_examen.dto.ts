import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateSerieExamenDto{

    @IsOptional()
    @IsNumber()
    examen: number;

    @IsOptional()
    @IsNumber()
    serie: number;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_modifica: string;

}