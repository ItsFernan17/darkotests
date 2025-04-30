import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdatePreguntaDto {

    @IsString()
    @IsOptional()
    @MinLength(5, { message: "La descripción debe tener mínimo 5 caracteres" })
    descripcion: string;
    
    @IsNumber()
    @IsOptional()
    @Min(1, { message: "El punteo debe tener mínimo 1 caracteres" })
    punteo: number;

    @IsNumber()
    @IsOptional()
    tipo_pregunta: number;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_modifica: string;
}
