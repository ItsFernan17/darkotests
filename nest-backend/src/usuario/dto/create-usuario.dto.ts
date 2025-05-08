import { IsOptional, IsNumber } from 'class-validator';

export class CreateUsuarioDto {
  dpi: string;

  nombre_completo: string;

  telefono: string;

  rol: string;

  password: string;

  residencia: number;

  @IsOptional()
  @IsNumber()
  grado?: number | null;

  @IsOptional()
  @IsNumber()
  poblacion?: number | null;

  @IsOptional()
  @IsNumber()
  comando?: number | null;
}
