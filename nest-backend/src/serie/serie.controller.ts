import { Controller, Get, Post, Put, Patch, Body, Param } from '@nestjs/common';
import { SerieService } from './serie.service';
import { CreateSerieDto, UpdateSerieDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
@Controller('serie')
export class SerieController {
  constructor(private readonly serieService: SerieService) {}

  @Get()
  getSeries() {
    return this.serieService.findAll();
  }

  @Get(':codigo_serie')
  getSerieById(@Param('codigo_serie') codigo_serie: number) {
    return this.serieService.findById(codigo_serie);
  }

  @Post()
  createSerie(@Body() newSerie: CreateSerieDto) {
    return this.serieService.createSerie(newSerie);
  }

  @Put(':codigo_serie')
  updateSerie(@Param('codigo_serie') codigo_serie: number, @Body() updateSerie: UpdateSerieDto) {
    return this.serieService.updateSerie(codigo_serie, updateSerie);
  }

  @Patch(':codigo_serie/estado')
  desactiveSerie(@Param('codigo_serie') codigo_serie: number) {
    return this.serieService.desactiveSerie(codigo_serie);
  }
  
}
