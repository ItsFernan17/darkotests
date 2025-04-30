import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Respuesta } from './model/respuesta.entity';
import { CreateRespuestaDto, UpdateRespuestaDto } from './dto';


@Injectable()
export class RespuestaService {
    constructor(
        @InjectRepository(Respuesta)
        private respuestaRepository: Repository<Respuesta>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {}

    async findAll(){
        return this.respuestaRepository.find({
            where: { estado: true },
        });
    }

    async findByRespuesta(respuesta: string): Promise<Respuesta | null> {
        return await this.respuestaRepository.findOne({ where: { respuesta } });
    }

    async findById(codigo_respuesta: number){
        const respuestaExistente = await this.respuestaRepository.findOne({
            where: { codigo_respuesta, estado: true },
        });

        if (!respuestaExistente) {
            return new HttpException(
                'La respuesta con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        return respuestaExistente;
    }

    async createRespuesta(createRespuestaDto: CreateRespuestaDto){

        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: createRespuestaDto.usuario_ingreso} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        const newRespuesta = this.respuestaRepository.create({
            respuesta: createRespuestaDto.respuesta,
            estado: true,
            esCorrecta: createRespuestaDto.esCorrecta,
            usuario_ingreso: usuario,
            fecha_ingreso: new Date(),
            fecha_modifica: null,
        });

        return this.respuestaRepository.save(newRespuesta);
    }

    async updateRespuesta(codigo_respuesta: number, updateRespuestaDto: UpdateRespuestaDto){
        const respuestaExistente = await this.respuestaRepository.findOne({
            where: { codigo_respuesta },
        });

        if (!respuestaExistente) {
            return new HttpException(
                'La respuesta con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        respuestaExistente.respuesta = updateRespuestaDto.respuesta;
        respuestaExistente.esCorrecta = updateRespuestaDto.esCorrecta;
        respuestaExistente.fecha_modifica = new Date();

        return this.respuestaRepository.save(respuestaExistente);
    }

    async desactiveRespuesta(codigo_respuesta: number){
        const respuestaExistente = await this.respuestaRepository.findOne({
            where: { codigo_respuesta },
        });

        if (!respuestaExistente) {
            return new HttpException(
                'La respuesta con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        respuestaExistente.estado = false;

        return this.respuestaRepository.save(respuestaExistente);
    }
}
