import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateDepartamentoDto {
  @IsBoolean()
  estado: boolean;

  @IsString()
  @MinLength(10)
  nombre_departamento: string;
}
