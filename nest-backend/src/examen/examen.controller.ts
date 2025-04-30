import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { ExamenService } from './examen.service';
import { CreateExamenDto, UpdateExamenDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
@Controller('examen')
export class ExamenController {
  constructor(private readonly examenService: ExamenService) {}

  @Get()
  findAll() {
    return this.examenService.findAll();
  }

  @Get(':codigo_examen')
  findById(@Param('codigo_examen') codigo_examen: number) {
    return this.examenService.findById(codigo_examen);
  }

  @Post()
  createExamen(@Body() createExamenDto: CreateExamenDto) {
    return this.examenService.createExamen(createExamenDto);
  }

  @Put(':codigo_examen')
  updateExamen(@Param('codigo_examen') codigo_examen: number, @Body() updateExamenDto: UpdateExamenDto) {
    return this.examenService.updateExamen(codigo_examen, updateExamenDto);
  }

  @Patch(':codigo_examen/estado')
  deleteExamen(@Param('codigo_examen') codigo_examen: number) {
    return this.examenService.desactiveExamen(codigo_examen);
  }

}
