import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamenDto, UpdateExamenDto } from './dto';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { TipoExamen } from 'src/tipo-examen/model/tipo-examen.entity';
import { Empleo } from 'src/empleo/model/empleo.entity';
import { TipoExamenService } from 'src/tipo-examen/tipo-examen.service';
import { Examen } from './model/examen.entity';
import { Motivo } from 'src/seed-db/motivo/model/motivo.entity';


@Injectable()
export class ExamenService {

    constructor(
        @InjectRepository(Examen)
        private examenRepository: Repository<Examen>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(TipoExamen)
        private tipoExamenRepository: Repository<TipoExamen>,
        @InjectRepository(Motivo)
        private motivoRepository: Repository<Motivo>,
    ){}

    async findAll() {
        return this.examenRepository.find({
          where: { estado: true },
          relations: ['tipo_examen', 'motivo_examen'],
          select: {
            tipo_examen: {
              description: true,  // Incluye la descripción del tipo de examen
            },
            motivo_examen: {
                nombre_motivo: true,  // Incluye la descripción del motivo de examen
            },
          },
        });
      }

    async findByTipoExamen(codigo_tipoE: number){
        return this.examenRepository.find({
            where: { tipo_examen: { codigo_tipoE }, estado: true },
        });
    }


    async findById(codigo_examen: number){
        const examenExistente = await this.examenRepository.findOne({
            where: { codigo_examen, estado: true },
            relations: ['tipo_examen', 'motivo_examen'],
            select: {
                tipo_examen: {
                  description: true,
                },
                motivo_examen: {
                    nombre_motivo: true, 
                },
              },
        });

        if (!examenExistente) {
            return new HttpException(
                'El examen con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        return examenExistente;
    }

    async createExamen(createExamenDto: CreateExamenDto){
        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: createExamenDto.usuario_ingreso} });
        

        const tipoExamen = await this.tipoExamenRepository.findOne({ where: { codigo_tipoE: createExamenDto.tipo_examen} });

        const motivoExamen = await this.motivoRepository.findOne({ where: { codigo_motivo: createExamenDto.motivo_examen} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!tipoExamen) {
            throw new HttpException('El tipo de examen no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!motivoExamen) {
            throw new HttpException('El motivo de examen no encontrado.', HttpStatus.NOT_FOUND);
        }


        const newExamen = this.examenRepository.create({
            fecha_evaluacion: createExamenDto.fecha_evaluacion,
            estado: true,
            tipo_examen: tipoExamen,
            motivo_examen: motivoExamen,
            punteo_maximo: createExamenDto.punteo_maximo,
            usuario_ingreso: usuario,
            fecha_ingreso: new Date(),
            fecha_modifica: null,
        });

        return this.examenRepository.save(newExamen);
    }

    async updateExamen(codigo_examen: number, updateExamenDto: UpdateExamenDto){

        const examenExistente = await this.examenRepository.findOne({
            where: { codigo_examen },
        });

        if (!examenExistente) {
            return new HttpException(
                'El examen con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: updateExamenDto.usuario_modifica} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        const tipoExamen = await this.tipoExamenRepository.findOne({ where: { codigo_tipoE: updateExamenDto.tipo_examen} });

        if (!tipoExamen) {
            throw new HttpException('El tipo de examen no encontrado.', HttpStatus.NOT_FOUND);
        }

        const motivoExamen = await this.motivoRepository.findOne({ where: { codigo_motivo: updateExamenDto.motivo_examen} });

        if (!motivoExamen) {
            throw new HttpException('El motivo de examen no encontrado.', HttpStatus.NOT_FOUND);
        }

        examenExistente.fecha_evaluacion = updateExamenDto.fecha_evaluacion;
        examenExistente.tipo_examen = tipoExamen;
        examenExistente.motivo_examen = motivoExamen;
        examenExistente.punteo_maximo = updateExamenDto.punteo_maximo;
        examenExistente.usuario_modifica = usuario;
        examenExistente.fecha_modifica = new Date();   
    }

    async desactiveExamen(codigo_examen: number){
        const examenExistente = await this.examenRepository.findOne({
            where: { codigo_examen },
        });

        if (!examenExistente) {
            return new HttpException(
                'El examen con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        examenExistente.estado = false;

        return this.examenRepository.save(examenExistente);
    }



}
