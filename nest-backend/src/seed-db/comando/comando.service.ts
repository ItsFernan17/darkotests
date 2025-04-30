import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comando } from './model/comando.entity';
import { CreateComandoDto } from './dto';
@Injectable()
export class ComandoService {
    constructor(
        @InjectRepository(Comando)
        private readonly comandoRepository: Repository<Comando>,
    ) {}
    
    async findAll() {
        return this.comandoRepository.find();
    }
    
    async createComando(createComandoDto: CreateComandoDto) {
        try {
        const comando = this.comandoRepository.create(createComandoDto);
        await this.comandoRepository.save(comando);
        return { ...comando };
        } catch (error) {
        console.error('Error al insertar los comandos:', error);
        throw new BadRequestException(
            'No se pudo insertar el comando: ' + error.message,
        );
        }
    }
}
