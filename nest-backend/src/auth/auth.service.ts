import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {

        const usuario = await this.usuarioService.findByDPI(registerDto.dpi);

        if(usuario) {
            throw new BadRequestException('El usuario ya existe');
        }

        console.log("Valor de role en registerDto:", registerDto.role);

        const register = await this.usuarioService.createUsuario({
            dpi: registerDto.dpi,
            nombre_completo: registerDto.nombre_completo,
            telefono: registerDto.telefono,
            rol: registerDto.role,
            residencia: registerDto.residencia,
            grado: registerDto.grado,
            poblacion: registerDto.poblacion,
            comando: registerDto.comando,
            password: await bcryptjs.hash(registerDto.password, 10),
        });

        const { password, ...result } = register;

        return result;
    }


    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioService.findByUsuarioWithPassword(loginDto.usuario);
    
        if (!usuario) {
            throw new UnauthorizedException('El usuario no es correcto');
        }
    
        const isPasswordValid = await bcryptjs.compare(loginDto.password, usuario.password);
    
        if (!isPasswordValid) {
            throw new UnauthorizedException('La contraseña no es correcta');
        }
    
        const payload = { user: usuario.nombre_usuario, rol: usuario.rol, dpi: usuario.dpi };
    
        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '30m' });
    
        const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    
        return {
            accessToken,
            refreshToken,
            usuario: usuario.nombre_usuario,
            dpi: usuario.dpi,
        };
    }

    async profile({ usuario, rol }: { usuario: string; rol: string }) {
        return await this.usuarioService.findByUsername(usuario);
      }

}
