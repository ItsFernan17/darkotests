import { Body, Controller, Get, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { UserRequest } from './interfaces/user-request.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveI } from 'src/common/interfaces/user-active.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('register')
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('validate-token')
  @UseGuards(AuthGuard)
  validateToken(@Req() req: UserRequest) {
    return { username: req.user.username };
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const newAccessToken = await this.jwtService.signAsync(
        { user: payload.user, rol: payload.rol },
        { expiresIn: '30m' },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token no válido');
    }
  }

  @Get('profile')
  @Auth(Role.EVALUADOR)
  getProfile(@ActiveUser() user: UserActiveI) {
    return this.authService.profile(user);
  }
}