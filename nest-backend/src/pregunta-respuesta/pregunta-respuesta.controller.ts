import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { PreguntaRespuestaService } from './pregunta-respuesta.service';
import { CreatePreguntaRespuestaDto, UpdatePreguntaRespuestaDto } from './dto';
import { CreatePreguntaDto, UpdatePreguntaDto } from 'src/pregunta/dto';
import { CreateRespuestaDto } from 'src/respuesta/dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
@Controller('pregunta-respuesta')
export class PreguntaRespuestaController {
  constructor(
    private readonly preguntaRespuestaService: PreguntaRespuestaService,
  ) {}

  @Get()
  findAll() {
    return this.preguntaRespuestaService.findAll();
  }

  @Get('preguntas')
  findAllPreguntasConRespuestas() {
    return this.preguntaRespuestaService.findPreguntasRespuestas();
  }
  @Get('preguntas/:id')
  async findPreguntaById(@Param('id') codigo_pregunta: number) {
    return this.preguntaRespuestaService.findPreguntaById(codigo_pregunta);
  }

  @Get(':codigo_pre_res')
  findById(@Param('codigo_pre_res') codigo_pre_res: number) {
    return this.preguntaRespuestaService.findById(codigo_pre_res);
  }

  @Post()
  createPreguntaRespuesta(
    @Body() createPreguntaRespuestaDto: CreatePreguntaRespuestaDto,
  ) {
    return this.preguntaRespuestaService.createPreguntaRespuesta(
      createPreguntaRespuestaDto,
    );
  }

  @Post('registrar-pregunta')
  async registerPreguntaConRespuestas(@Body() body: any) {
    const preguntasConRespuestas = Array.isArray(body) ? body : [body];

    const formattedPreguntasConRespuestas = preguntasConRespuestas.map(
      (item: any) => {
        const createPreguntaDto: CreatePreguntaDto = {
          usuario_ingreso: item.usuario_ingreso,
          descripcion: item.descripcion,
          punteo: item.punteo,
          tipo_pregunta: item.tipo_pregunta,
        };

        const createRespuestasDto: CreateRespuestaDto[] = item.respuestas.map(
          (respuesta: any) => ({
            respuesta: respuesta.respuesta,
            esCorrecta: respuesta.esCorrecta,
            usuario_ingreso: respuesta.usuario_ingreso,
          }),
        );

        return { pregunta: createPreguntaDto, respuestas: createRespuestasDto };
      },
    );

    return this.preguntaRespuestaService.registerPreguntasConRespuestas(
      formattedPreguntasConRespuestas,
    );
  }

  @Put(':codigo_pre_res')
  updatePreguntaRespuesta(
    @Param('codigo_pre_res') codigo_pre_res: number,
    @Body() updatePreguntaRespuestaDto: UpdatePreguntaRespuestaDto,
  ) {
    return this.preguntaRespuestaService.updatePreguntaRespuesta(
      codigo_pre_res,
      updatePreguntaRespuestaDto,
    );
  }

  @Put('actualizar-pregunta/:id')
  async updatePreguntaYRespuestas(
    @Param('id') id: number,
    @Body() updateData: { pregunta: UpdatePreguntaDto, respuestas: { respuesta: string, esCorrecta: boolean, usuario_modifica: string }[] }
  ) {
      const { pregunta, respuestas } = updateData;
      const updatedPreguntaConRespuestas = await this.preguntaRespuestaService.updatePreguntaYRespuestas(id, pregunta, respuestas);
      return updatedPreguntaConRespuestas;

  }

  @Patch('pregunta/:codigo_pregunta/estado')
  deletePreguntaRespuesta(@Param('codigo_pregunta') codigo_pregunta: number) {
    return this.preguntaRespuestaService.desactivePreguntaRespuesta(
      codigo_pregunta,
    );
  }
}
