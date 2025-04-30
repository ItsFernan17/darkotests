import { HttpException, HttpStatus, Injectable  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Serie } from './model/serie.entity';
import { CreateSerieDto, UpdateSerieDto } from './dto';
import { Usuario } from 'src/usuario/model/usuario.entity';

@Injectable()
export class SerieService {

    constructor(
        @InjectRepository(Serie)
        private serieRepository: Repository<Serie>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async findAll(){
        return this.serieRepository.find({
            where: { estado: true },
        });
    }

    async findByInstruccion(instrucciones: string): Promise<Serie | null> {
        return await this.serieRepository.findOne({ where: { instrucciones } });
    }

    async findById(codigo_serie: number){
        const serieExistente = await this.serieRepository.findOne({
            where: { codigo_serie, estado: true },
        });

        if (!serieExistente) {
            return new HttpException(
                'La serie con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        return serieExistente;
    }

    async createSerie(createSerieDto: CreateSerieDto){

        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: createSerieDto.usuario_ingreso} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        const newSerie = this.serieRepository.create({
            nombre: createSerieDto.nombre,
            instrucciones: createSerieDto.instrucciones,
            estado: true,
            usuario_ingreso: usuario,
            fecha_ingreso: new Date(),
            fecha_modifica: null,
        });

        return this.serieRepository.save(newSerie);
    }

    async updateSerie(codigo_serie: number, updateSerieDto: UpdateSerieDto){
        const serieExistente = await this.serieRepository.findOne({
            where: { codigo_serie },
        });

        if (!serieExistente) {
            return new HttpException(
                'La serie con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        serieExistente.nombre = updateSerieDto.nombre;
        serieExistente.instrucciones = updateSerieDto.instrucciones;
        serieExistente.fecha_modifica = new Date();

        return this.serieRepository.save(serieExistente);
    }

    async desactiveSerie(codigo_serie: number){
        const serieExistente = await this.serieRepository.findOne({
            where: { codigo_serie },
        });

        if (!serieExistente) {
            return new HttpException(
                'La serie con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        serieExistente.estado = false;
        serieExistente.fecha_modifica = new Date();

        return this.serieRepository.save(serieExistente);
    }
    
}
