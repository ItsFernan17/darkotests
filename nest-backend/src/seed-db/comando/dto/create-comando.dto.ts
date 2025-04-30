import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateComandoDto {
  @IsBoolean()
  estado: boolean;

  @IsString()
  @MinLength(10)
  nombre_comando: string;
}
