import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdatePreguntaRespuestaDto{

    @IsOptional()
    @IsNumber()
    pregunta: number;

    @IsOptional()
    @IsNumber()
    respuesta: number;

    @IsString()
    @IsOptional()
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_modifica: string;

}