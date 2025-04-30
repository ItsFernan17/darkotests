import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreatePreguntaRespuestaDto{

    @IsNotEmpty({message: 'La pregunta es requerida'})
    @IsNumber()
    pregunta: number;

    @IsNotEmpty({message: 'La respuestaes requerida'})
    @IsNumber()
    respuesta: number;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;

}