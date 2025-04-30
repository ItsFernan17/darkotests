import { BadRequestException, Injectable } from '@nestjs/common';
import { Poblacion } from './model/poblacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePoblacionDto } from './dto';

@Injectable()
export class PoblacionService {
  constructor(
    @InjectRepository(Poblacion)
    private readonly poblacionRepository: Repository<Poblacion>,
  ) {}

  async findAll() {
    return this.poblacionRepository.find();
  }

  async createPoblacion(createPoblacionDto: CreatePoblacionDto) {
    try {
      const poblacion = this.poblacionRepository.create(
        createPoblacionDto
    );
      await this.poblacionRepository.save(poblacion);
      return { ...poblacion };
    } catch (error) {
      console.error('Error al insertar las poblaciones:', error);
      throw new BadRequestException(
        'No se pudo insertar la poblacion: ' + error.message,
      );
    }
  }
}
