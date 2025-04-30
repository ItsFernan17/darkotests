import { BadRequestException, Injectable } from '@nestjs/common';
import { Grado } from './model/grado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGradoDto } from './dto';

@Injectable()
export class GradoService {
  constructor(
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
  ) {}

  async findAll() {
    return this.gradoRepository.find();
  }

  async createGrado(createGradoDto: CreateGradoDto) {
    try {
      const grado = this.gradoRepository.create(createGradoDto);
      await this.gradoRepository.save(grado);
      return { ...grado };
    } catch (error) {
      console.error('Error al insertar los grados:', error);
      throw new BadRequestException(
        'No se pudo insertar el grado: ' + error.message,
      );
    }
  }
}
