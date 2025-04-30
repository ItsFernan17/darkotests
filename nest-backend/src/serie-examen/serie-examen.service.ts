import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SerieExamen } from './model/serie-examen.entity';
import { CreateSerieExamenDto, UpdateSerieExamenDto } from './dto';
import { Examen } from 'src/examen/model/examen.entity';
import { Serie } from 'src/serie/model/serie.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';

@Injectable()
export class SerieExamenService {

    constructor(
        @InjectRepository(SerieExamen)
        private serieExamenRepository: Repository<SerieExamen>,
        @InjectRepository(Examen)
        private examenRepository: Repository<Examen>,
        @InjectRepository(Serie)
        private serieRepository: Repository<Serie>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ){}

    async findAll(){
        return this.serieExamenRepository.find({
            where: { estado: true },
        });
    }

    async findById(codigo_se_ex: number){
        const serieExamenExistente = await this.serieExamenRepository.findOne({
            where: { codigo_se_ex, estado: true },
        });

        if (!serieExamenExistente) {
            return new HttpException(
                'La serie-examen con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        return serieExamenExistente;
    }

    async createSerieExamen(createSerieExamenDto: CreateSerieExamenDto){

        const examen = await this.examenRepository.findOne({ where: { codigo_examen: createSerieExamenDto.examen } });
        const serie = await this.serieRepository.findOne({ where: { codigo_serie: createSerieExamenDto.serie } });
        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: createSerieExamenDto.usuario_ingreso } });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!examen) {
            throw new HttpException('Examen no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!serie) {
            throw new HttpException('Serie no encontrada.', HttpStatus.NOT_FOUND);
        }

        const newSerieExamen = this.serieExamenRepository.create({
            estado: true,
            examen: examen,
            serie: serie,
            usuario_ingreso: usuario,
            fecha_ingreso: new Date(),
            fecha_modifica: null
        });

        return this.serieExamenRepository.save(newSerieExamen);
    }

    async updateSerieExamen(codigo_se_ex: number, updateSerieExamenDto: UpdateSerieExamenDto){

        const serieExamen = await this.serieExamenRepository.findOne({ where: { codigo_se_ex } });

        if (!serieExamen) {
            throw new HttpException('Serie-examen no encontrado.', HttpStatus.NOT_FOUND);
        }

        const examen = await this.examenRepository.findOne({ where: { codigo_examen: updateSerieExamenDto.examen } });
        const serie = await this.serieRepository.findOne({ where: { codigo_serie: updateSerieExamenDto.serie } });
        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: updateSerieExamenDto.usuario_modifica } });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!examen) {
            throw new HttpException('Examen no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!serie) {
            throw new HttpException('Serie no encontrada.', HttpStatus.NOT_FOUND);
        }

        serieExamen.examen = examen;
        serieExamen.serie = serie;
        serieExamen.usuario_modifica = usuario;
        serieExamen.fecha_modifica = new Date();

        return this.serieExamenRepository.save(serieExamen);
    }

    async desactiveSerieExamen(codigo_se_ex: number){
        const serieExamen = await this.serieExamenRepository.findOne({ where: { codigo_se_ex } });

        if (!serieExamen) {
            throw new HttpException('Serie-examen no encontrado.', HttpStatus.NOT_FOUND);
        }

        serieExamen.estado = false;

        return this.serieExamenRepository.save(serieExamen);
    }

}
