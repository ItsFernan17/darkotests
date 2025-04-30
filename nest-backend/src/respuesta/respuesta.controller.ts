import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { RespuestaService } from './respuesta.service';
import { CreateRespuestaDto, UpdateRespuestaDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
@Controller('respuesta')
export class RespuestaController {
  constructor(private readonly respuestaService: RespuestaService) {}

  @Get()
  findAll() {
    return this.respuestaService.findAll();
  }

  @Get(':codigo_respuesta')
  findById(@Param('codigo_respuesta') codigo_respuesta: number) {
    return this.respuestaService.findById(codigo_respuesta);
  }

  @Post()
  createRespuesta(@Body() createRespuestaDto: CreateRespuestaDto) {
    return this.respuestaService.createRespuesta(createRespuestaDto);
  }

  @Put(':codigo_respuesta')
  updateRespuesta(@Param('codigo_respuesta') codigo_respuesta: number, @Body() updateRespuestaDto: UpdateRespuestaDto) {
    return this.respuestaService.updateRespuesta(codigo_respuesta, updateRespuestaDto);
  }

  @Patch(':codigo_respuesta/estado')
  deleteRespuesta(@Param('codigo_respuesta') codigo_respuesta: number) {
    return this.respuestaService.desactiveRespuesta(codigo_respuesta);
  }

}
