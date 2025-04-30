import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Motivo } from './model/motivo.entity';
import { Repository } from 'typeorm';
import { CreateMotivoDto } from './dto';


@Injectable()
export class MotivoService {
    constructor(
        @InjectRepository(Motivo)
        private readonly motivoRepository: Repository<Motivo>,
      ) {}

    async findAll() {
        return this.motivoRepository.find();
    }

    async createMotivo(createMotivoDto: CreateMotivoDto) {
        try {
          const motivo = this.motivoRepository.create(createMotivoDto);
          await this.motivoRepository.save(motivo);
          return { ...motivo };
        } catch (error) {
          console.error('Error al insertar los motivos:', error);
          throw new BadRequestException(
            'No se pudo insertar el motivo: ' + error.message,
          );
        }
      }
}
