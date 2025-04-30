import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "../../common/enums/rol.enum";

export class RegisterDto{
    
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'El DPI es requerido'})
    @MinLength(13, {message: 'El DPI debe tener mínimo 13 caracteres'} )
    @MaxLength(15, {message: 'El DPI debe tener máximo 15 caracteres'})
    dpi: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(5, {message: 'El nombre Completo debe tener mínimo 5 caracteres'} )
    @IsNotEmpty( {message: 'El nombre Completo es requerido'})
    nombre_completo: string;

    @IsString()
    @MinLength(8, {message: 'El telefono debe tener mínimo 8 caracteres'} )
    @MaxLength(10, {message: 'El telefono debe tener máximo 10 caracteres'})
    @IsNotEmpty( {message: 'El telefono es requerido'})
    telefono: string;

    @IsString()
    @IsNotEmpty( {message: 'El Rol del Usuario es requerido'})
    role: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty( {message: 'La contraseña es requerida'})
    @MinLength(8, {message: 'La contraseña debe tener mínimo 8 caracteres'})
    password: string;

    @IsNumber()
    @IsNotEmpty( {message: 'El grado es requerido'})
    grado: number;

    @IsNumber()
    @IsNotEmpty( {message: 'La poblacion es requerida'})
    poblacion: number;

    @IsNumber()
    @IsNotEmpty( {message: 'La residencia es requerida'})
    residencia: number;

    @IsNumber()
    @IsNotEmpty( {message: 'El comando es requerido'})
    comando: number;
}