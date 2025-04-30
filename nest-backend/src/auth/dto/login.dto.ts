import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto{
    
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'El usuario es requerido'})
    @MinLength(4, {message: 'El usuario debe tener mínimo 4 caracteres'} )
    usuario: string;


    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'La contraseña es requerida'})
    @MinLength(8, {message: 'La contraseña debe tener mínimo 8 caracteres'})
    password: string;
}