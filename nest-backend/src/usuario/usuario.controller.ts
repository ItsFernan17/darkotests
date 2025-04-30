import { Controller, Get, Post, Body, Patch, Param, Put, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { Role } from 'src/common/enums/rol.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Get()
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR, Role.EVALUADOR)
  getUsuarios() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR, Role.EVALUADOR)
  getUsuarioId(@Param('id') dpi: string) {
    return this.usuarioService.findByDPI(dpi);
  }

  @Post()
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR)
  createUsuario(@Body() newUsuario: CreateUsuarioDto) {
    return this.usuarioService.createUsuario(newUsuario);
  }

  @Put(':dpi')
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR)
  updateUsuario(@Param('dpi') dpi: string, @Body() updateUsuario: UpdateUsuarioDto) {
    return this.usuarioService.updateUsuario(dpi, updateUsuario);
  }

  @Patch(':id/estado')
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR)
  desactiveUsuario(@Param('id') dpi: string) {
    return this.usuarioService.desactiveUsuario(dpi);
  }

}
