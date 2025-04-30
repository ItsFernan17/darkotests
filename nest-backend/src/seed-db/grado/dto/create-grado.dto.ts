import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateGradoDto {
  @IsBoolean()
  estado: boolean;

  @IsString()
  @MinLength(10)
  nombre_grado: string;
}