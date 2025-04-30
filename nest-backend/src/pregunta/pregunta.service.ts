import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { TipoPregunta } from 'src/seed-db/tipo-pregunta/model/tipo-pregunta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta } from './model/pregunta.entity';
import { CreatePreguntaDto, UpdatePreguntaDto } from './dto';

@Injectable()
export class PreguntaService { 
    constructor(
        @InjectRepository(TipoPregunta)
        private tipoPreguntaRepository: Repository<TipoPregunta>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Pregunta)
        private preguntaRepository: Repository<Pregunta>,
    ) {}
    
    async findAll() {
        return this.preguntaRepository.find({
          where: { estado: true }, // Filtra solo las preguntas activas
          relations: ['tipo_pregunta'], // Trae la relación con TipoPregunta
          select: {
            tipo_pregunta: {
              descripcion: true, // Selecciona la descripción del tipo de pregunta
            },
          },
        });
      }

    async findByPregunta(descripcion: string): Promise<Pregunta | null> {
        return await this.preguntaRepository.findOne({ where: { descripcion } });
    }

    async findById(codigo_pregunta: number){
        const preguntaExistente = await this.preguntaRepository.findOne({
            where: { codigo_pregunta, estado: true },
        });

        if (!preguntaExistente) {
            return new HttpException(
                'La pregunta con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        return preguntaExistente;
    }

    async createPregunta(createPreguntaDto: CreatePreguntaDto){
        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: createPreguntaDto.usuario_ingreso} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        const tipoPregunta = await this.tipoPreguntaRepository.findOne({ where: { codigo_tipoP: createPreguntaDto.tipo_pregunta } });

        if (!tipoPregunta) {
            throw new HttpException('Tipo de pregunta no encontrado.', HttpStatus.NOT_FOUND);
        }

        const newPregunta = this.preguntaRepository.create({
            descripcion: createPreguntaDto.descripcion,
            punteo: createPreguntaDto.punteo,
            estado: true,
            usuario_ingreso: usuario,
            fecha_ingreso: new Date(),
            fecha_modifica: null,
            tipo_pregunta: tipoPregunta,
        });

        return this.preguntaRepository.save(newPregunta);
    }

    async updatePregunta(codigo_pregunta: number, updatePregunta: UpdatePreguntaDto){
        const preguntaExistente = await this.preguntaRepository.findOne({ where: { codigo_pregunta, estado: true } });

        if (!preguntaExistente) {
            throw new HttpException('La pregunta con el código proporcionado no existe en la base de datos.', HttpStatus.NOT_FOUND);
        }

        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: updatePregunta.usuario_modifica } });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        const tipoPregunta = await this.tipoPreguntaRepository.findOne({ where: { codigo_tipoP: updatePregunta.tipo_pregunta } });

        if (!tipoPregunta) {
            throw new HttpException('Tipo de pregunta no encontrado.', HttpStatus.NOT_FOUND);
        }

        preguntaExistente.descripcion = updatePregunta.descripcion;
        preguntaExistente.punteo = updatePregunta.punteo;
        preguntaExistente.usuario_ingreso = usuario;
        preguntaExistente.fecha_modifica = new Date();
        preguntaExistente.tipo_pregunta = tipoPregunta;

        return this.preguntaRepository.save(preguntaExistente);
    }

    async desactivePregunta(codigo_pregunta: number){
        const preguntaExistente = await this.preguntaRepository.findOne({ where: { codigo_pregunta, estado: true } });

        if (!preguntaExistente) {
            throw new HttpException('La pregunta con el código proporcionado no existe en la base de datos.', HttpStatus.NOT_FOUND);
        }

        preguntaExistente.estado = false;
        preguntaExistente.fecha_modifica = new Date();

        return this.preguntaRepository.save(preguntaExistente);
    }
    

}
