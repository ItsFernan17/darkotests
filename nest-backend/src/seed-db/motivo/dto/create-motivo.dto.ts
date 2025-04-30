import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateMotivoDto {
  @IsBoolean()
  estado: boolean;

  @IsString()
  @MinLength(10)
  nombre_motivo: string;
}
