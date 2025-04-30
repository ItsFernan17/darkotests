import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAsignacionDto {
    @IsString()
    @IsOptional()
    evaluado?: string;

    @IsNumber()
    @IsOptional()
    evaluacion?: number;

    @IsString()
    @IsOptional()
    usuario_modifica?: string;
}
