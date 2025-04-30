import { IsEnum, IsOptional } from "class-validator";

export class UpdateUsuarioDto {

  @IsOptional()
  dpi?: string;

  @IsOptional()
  nombre_completo?: string;

  @IsOptional()
  telefono?: string;

  @IsOptional()
  rol?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  grado?: number;

  @IsOptional()
  poblacion?: number;

  @IsOptional()
  residencia?: number;

  @IsOptional()
  comando?: number;
}
