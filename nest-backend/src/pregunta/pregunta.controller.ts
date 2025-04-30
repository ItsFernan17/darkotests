import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { PreguntaService } from './pregunta.service';
import { CreatePreguntaDto, UpdatePreguntaDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
@Controller('pregunta')
export class PreguntaController {
  constructor(private readonly preguntaService: PreguntaService) {}

  @Get()
  getPreguntas() {
    return this.preguntaService.findAll();
  }

  @Get(':codigo_pregunta')
  getPreguntaById(@Param('codigo_pregunta') codigo_pregunta: number) {
    return this.preguntaService.findById(codigo_pregunta);
  }

  @Post()
  createPregunta(@Body() newPregunta: CreatePreguntaDto) {
    return this.preguntaService.createPregunta(newPregunta);
  }

  @Put(':codigo_pregunta')
  updatePregunta(@Param('codigo_pregunta') codigo_pregunta: number, @Body() updatePregunta: UpdatePreguntaDto) {
    return this.preguntaService.updatePregunta(codigo_pregunta, updatePregunta);
  }

  @Patch(':codigo_pregunta/estado')
  desactivePregunta(@Param('codigo_pregunta') codigo_pregunta: number) {
    return this.preguntaService.desactivePregunta(codigo_pregunta);
  }
}
