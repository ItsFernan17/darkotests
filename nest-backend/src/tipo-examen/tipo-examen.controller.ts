import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { TipoExamenService } from './tipo-examen.service';
import { CreateTipoExamenDto, UpdateTipoExamenDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Controller('tipo-examen')
export class TipoExamenController {
  constructor(
    private readonly tipoExamenService: TipoExamenService
  ) {}

  @Get()
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  getTipoExamenes() {
    return this.tipoExamenService.findAll();
  }

  @Get(':codigo_tipoE')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  getTipoExamenById(@Param('codigo_tipoE') codigo_tipoE: number) {
    return this.tipoExamenService.findById(codigo_tipoE);
  }

  @Post()
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  createTipoExamen(@Body() newTipoExamen: CreateTipoExamenDto) {
    return this.tipoExamenService.createTipoExamen(newTipoExamen);
  }

  @Put(':codigo_tipoE')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  updateTipoExamen(@Param('codigo_tipoE') codigo_tipoE: number, @Body() updateTipoExamen: UpdateTipoExamenDto) {
    return this.tipoExamenService.updateTipoExamen(codigo_tipoE, updateTipoExamen);
  }

  @Patch(':codigo_tipoE/estado')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  desactiveTipoExamen(@Param('codigo_tipoE') codigo_tipoE: number) {
    return this.tipoExamenService.desactiveTipoExamen(codigo_tipoE);
  }















}
