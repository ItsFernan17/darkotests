import { IsDateString, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateExamenDto {

    @IsDateString()
    @IsOptional()
    fecha_evaluacion: Date;

    @IsNumber()
    @IsOptional()
    tipo_examen: number;

    @IsNumber()
    @IsOptional()
    motivo_examen: number;

    @IsNumber()
    @IsOptional()
    punteo_maximo: number;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_modifica?: string;
}