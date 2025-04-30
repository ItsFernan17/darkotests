import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePunteoDto {
  @IsNotEmpty()
  @IsNumber()
  punteo: number;
}
