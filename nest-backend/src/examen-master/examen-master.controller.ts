import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { ExamenMasterService } from './examen-master.service';
import { CreateExamenMasterDto, UpdateExamenMasterDto } from './dto';
import { ExamenMasterDto } from './dto/create-examen.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Controller('examen-master')
export class ExamenMasterController {
  constructor(private readonly examenMasterService: ExamenMasterService) {}

  @Get()
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  findAll() {
    return this.examenMasterService.findAll();
  }

  @Get(':codigo_master')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  findById(@Param('codigo_master') codigo_master: number) {
    return this.examenMasterService.findById(codigo_master);
  }

  @Get('informacion/:codigo_examen')
  findAllExamen(@Param('codigo_examen') codigo_examen: number) {
    return this.examenMasterService.getExamenDetail(codigo_examen);
  }

  @Post()
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  createExamenMaster(@Body() createExamenMasterDto: CreateExamenMasterDto) {
    return this.examenMasterService.createExamenMaster(createExamenMasterDto);
  }

  @Post('crear-examen')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  async createExamen(@Body() createExamenDto: ExamenMasterDto) {
    return await this.examenMasterService.createExamen(createExamenDto);
  }

  @Put(':codigo_master')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  updateExamenMaster(
    @Param('codigo_master') codigo_master: number,
    @Body() updateExamenMasterDto: UpdateExamenMasterDto,
  ) {
    return this.examenMasterService.updateExamenMaster(
      codigo_master,
      updateExamenMasterDto,
    );
  }

  @Put('actualizar/:codigo_examen')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  async updateExamen(
    @Param('codigo_examen') codigo_examen: number,
    @Body() updateExamenMasterDto: ExamenMasterDto,
  ) {
    return await this.examenMasterService.updateExamen(
      codigo_examen,
      updateExamenMasterDto,
    );
  }

  @Patch(':codigo_master/estado')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  deletePreguntaRespuesta(@Param('codigo_master') codigo_master: number) {
    return this.examenMasterService.desactiveExamenMaster(codigo_master);
  }

  @Patch('anular/:codigo_examen/estado')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  async anularExamen(@Param('codigo_examen') codigo_examen: number) {
    return this.examenMasterService.anularExamen(codigo_examen);
  }
}
