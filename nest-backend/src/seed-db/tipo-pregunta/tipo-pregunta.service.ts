import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { TipoPregunta } from './model/tipo-pregunta.entity';
import { CreateTipoPreguntaDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TipoPreguntaService {
  constructor(
    @InjectRepository(TipoPregunta)
    private readonly tipoPreguntaRepository: Repository<TipoPregunta>,
  ) {}

  async findAll() {
    return this.tipoPreguntaRepository.find();
  }

  async createTipoPregunta(createTipoPreguntaDto: CreateTipoPreguntaDto) {
    try {
      const tipoPregunta = this.tipoPreguntaRepository.create(
        createTipoPreguntaDto,
      );
      await this.tipoPreguntaRepository.save(tipoPregunta);
      return { ...tipoPregunta };
    } catch (error) {
      console.error('Error al insertar los tipos de preguntas:', error);
      throw new BadRequestException(
        'No se pudo insertar el tipo de pregunta: ' + error.message,
      );
    }
  }
}
