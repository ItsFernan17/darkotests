import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateEmpleoDto {

    @IsNotEmpty({ message: "El CEOM es obligatorio" })
    @IsString()
    @MinLength(1, { message: "El CEOM debe tener al menos 1 carácter" })
    ceom: string;

    @IsString()
    @IsNotEmpty({ message: "La descripción es obligatoria" })
    @MinLength(5, { message: "La descripción debe tener mínimo 5 caracteres" })
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
    @MinLength(4, { message: "El usuario debe tener mínimo 4 caracteres" })
    usuario_ingreso: string;
}
