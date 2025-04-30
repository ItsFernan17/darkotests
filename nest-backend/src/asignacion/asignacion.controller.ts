import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AsignacionService } from './asignacion.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import { Asignacion } from './model/asignacion.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePunteoDto } from './dto/update-punteo.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveI } from 'src/common/interfaces/user-active.interface';


@Controller('asignacion')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Get()
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR, Role.EVALUADO)
  getAsignaciones(@ActiveUser() user: UserActiveI){
    return this.asignacionService.findAll(user);
  }

  @Get(':codigo_asignacion')
  async getAsignacionById(
    @Param('codigo_asignacion') codigo_asignacion: number,
  ): Promise<Asignacion> {
    const asignacion = await this.asignacionService.findById(codigo_asignacion);
    if (asignacion instanceof HttpException) {
      throw asignacion;
    }
    return asignacion;
  }

  @Post()
  @Auth( Role.EVALUADOR, Role.ADMINISTRADOR)
  createAsignacion(
    @Body() newAsignacion: CreateAsignacionDto,
  ): Promise<Asignacion> {
    return this.asignacionService.createAsignacion(newAsignacion);
  }

  @Put(':codigo_asignacion')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  async updateAsignacion(
    @Param('codigo_asignacion') codigo_asignacion: number,
    @Body() updateAsignacion: UpdateAsignacionDto,
  ): Promise<Asignacion> {
    const asignacion = await this.asignacionService.updateAsignacion(
      codigo_asignacion,
      updateAsignacion,
    );
    if (asignacion instanceof HttpException) {
      throw asignacion;
    }
    return asignacion;
  }

  @Patch(':codigo_asignacion/estado')
  @Auth(Role.ADMINISTRADOR, Role.EVALUADOR)
  async desactiveAsignacion( @Param('codigo_asignacion') codigo_asignacion: number,){
      return this.asignacionService.desactiveAsignacion(codigo_asignacion);
  }

  @Get(':codigo_asignacion/datos')
  async getAsignacionConDatos(
    @Param('codigo_asignacion') codigo_asignacion: number,
  ) {
    const asignacion =
      await this.asignacionService.getAsignacionConDatos(codigo_asignacion);
    return asignacion;
  }

  @Put(':codigo_asignacion/punteo')
  async updatePunteo(
    @Param('codigo_asignacion') codigo_asignacion: number,
    @Body() updatePunteoDto: UpdatePunteoDto,
  ) {
    return this.asignacionService.updatePunteo(
      codigo_asignacion,
      updatePunteoDto.punteo,
    );
  }
}
