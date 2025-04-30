import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreatePreguntaDto {

    @IsString()
    @IsNotEmpty({ message: "La descripción es obligatoria" })
    @MinLength(5, { message: "La descripción debe tener mínimo 5 caracteres" })
    descripcion: string;
    
    @IsNumber()
    @IsNotEmpty({ message: "El punteo es obligatorio" })
    @Min(1, { message: "El punteo debe tener mínimo 1 caracteres" })
    punteo: number;

    @IsNumber()
    @IsNotEmpty({ message: "El tipo de pregunta es obligatorio" })
    tipo_pregunta: number;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;
}
