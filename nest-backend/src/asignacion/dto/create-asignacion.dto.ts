import { IsNotEmpty, IsString, IsInt, IsArray, ArrayNotEmpty } from "class-validator";

export class CreateAsignacionDto {
  @IsArray()
  @ArrayNotEmpty({ message: "Debe proporcionar al menos un evaluado" })
  @IsString({ each: true })
  evaluados: string[];

  @IsNotEmpty({ message: "El examen es obligatorio" })
  @IsInt({ message: "El examen debe ser un número entero" })
  examen: number;

  @IsString()
  @IsNotEmpty({ message: "El usuario de ingreso es obligatorio" })
  usuario_ingreso: string;
}
