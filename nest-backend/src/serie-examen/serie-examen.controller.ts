import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { SerieExamenService } from './serie-examen.service';
import { CreateSerieExamenDto, UpdateSerieExamenDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';


@Controller('serie-examen')
export class SerieExamenController {
  constructor(private readonly serieExamenService: SerieExamenService) {}

  @Get()
  findAll() {
    return this.serieExamenService.findAll();
  }

  @Get(':codigo_se_ex')
  findById(@Param('codigo_se_ex') codigo_se_ex: number) {
    return this.serieExamenService.findById(codigo_se_ex);
  }

  @Post()
  createSerieExamen(@Body() createSerieExamenDto: CreateSerieExamenDto) {
    return this.serieExamenService.createSerieExamen(createSerieExamenDto);
  }

  @Put(':codigo_se_ex')
  updateSerieExamen(@Param('codigo_se_ex') codigo_se_ex: number, @Body() updateSerieExamenDto: UpdateSerieExamenDto) {
    return this.serieExamenService.updateSerieExamen(codigo_se_ex, updateSerieExamenDto);
  }

  @Patch(':codigo_se_ex/estado')
  deleteSerieExamen(@Param('codigo_se_ex') codigo_se_ex: number) {
    return this.serieExamenService.desactiveSerieExamen(codigo_se_ex);
  }


}
