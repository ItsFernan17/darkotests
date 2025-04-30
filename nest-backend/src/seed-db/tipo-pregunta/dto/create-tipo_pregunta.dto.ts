import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateTipoPreguntaDto {
  @IsBoolean()
  estado: boolean;

  @IsString()
  @MinLength(10)
  descripcion: string;
}
