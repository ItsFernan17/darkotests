import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateExamenMasterDto{

    @IsOptional()
    @IsNumber()
    serie_examen: number;

    @IsOptional()
    @IsNumber()
    pregunta: number;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_modifica: string;

}