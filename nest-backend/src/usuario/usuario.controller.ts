import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  Body,
  Patch,
  Param,
  Put,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { Role } from 'src/common/enums/rol.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR, Role.EVALUADOR)
  getUsuarios() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR, Role.EVALUADOR, Role.EVALUADO)
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
  updateUsuario(
    @Param('dpi') dpi: string,
    @Body() updateUsuario: UpdateUsuarioDto,
  ) {
    return this.usuarioService.updateUsuario(dpi, updateUsuario);
  }

  @Patch(':id/estado')
  @Auth(Role.ADMINISTRADOR, Role.AUXILIAR)
  desactiveUsuario(@Param('id') dpi: string) {
    return this.usuarioService.desactiveUsuario(dpi);
  }

  @Post('fotos')
  @Post('fotos')
  @Auth(Role.EVALUADO)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto_frente', maxCount: 1 },
      { name: 'foto_perfil_izquierdo', maxCount: 1 },
      { name: 'foto_perfil_derecho', maxCount: 1 },
    ]),
  )
  async subirFotos(@UploadedFiles() files, @Req() req) {
    const user = req.user;
    const dpi = user?.dpi;

    if (!dpi) {
      throw new HttpException(
        'No se pudo determinar el DPI del usuario.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const foto_frente = files.foto_frente?.[0]?.buffer;
    const foto_perfil_izquierdo = files.foto_perfil_izquierdo?.[0]?.buffer;
    const foto_perfil_derecho = files.foto_perfil_derecho?.[0]?.buffer;

    return this.usuarioService.uploadFotos(dpi, {
      foto_frente,
      foto_perfil_izquierdo,
      foto_perfil_derecho,
    });
  }

  @Get(':dpi/mis-fotos')
  @Auth(Role.EVALUADO)
  async getMisFotos(@Req() req) {
    const dpi = req.user?.dpi;
    return this.usuarioService.getFotos(dpi);
  }
}
