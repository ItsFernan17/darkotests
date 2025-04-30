import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreatePoblacionDto {
  @IsBoolean()
  estado: boolean;

  @IsString()
  @MinLength(10)
  nombre_poblacion: string;
}
