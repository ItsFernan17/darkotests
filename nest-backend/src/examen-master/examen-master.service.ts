import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamenMaster } from './model/examen-master.entity';
import { CreateExamenMasterDto, UpdateExamenMasterDto } from './dto';
import { SerieExamen } from 'src/serie-examen/model/serie-examen.entity';
import { Pregunta } from 'src/pregunta/model/pregunta.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { ExamenMasterDto } from './dto/create-examen.dto';
import { TipoExamen } from 'src/tipo-examen/model/tipo-examen.entity';
import { Examen } from 'src/examen/model/examen.entity';
import { SerieExamenService } from 'src/serie-examen/serie-examen.service';
import { PreguntaService } from 'src/pregunta/pregunta.service';
import { Serie } from 'src/serie/model/serie.entity';
import { PreguntaRespuesta } from 'src/pregunta-respuesta/model/pregunta-respuesta.entity';
import { Motivo } from 'src/seed-db/motivo/model/motivo.entity';
import { SerieService } from 'src/serie/serie.service';

@Injectable()
export class ExamenMasterService {

    constructor(
        @InjectRepository(ExamenMaster)
        private examenMasterRepository: Repository<ExamenMaster>,
        @InjectRepository(SerieExamen)
        private serieExamenRepository: Repository<SerieExamen>,
        @InjectRepository(Pregunta)
        private preguntaRepository: Repository<Pregunta>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(TipoExamen)
        private tipoExamenRepository: Repository<TipoExamen>,
        @InjectRepository(Examen)
        private examenRepository: Repository<Examen>,
        @InjectRepository(Serie)
        private serieRepository: Repository<Serie>,
        @InjectRepository(PreguntaRespuesta)
        private preguntaRespuestaRepository: Repository<PreguntaRespuesta>,
        @InjectRepository(Motivo)
        private motivoRepository: Repository<Motivo>,
        private readonly serieExamenService: SerieExamenService,
        private readonly preguntasService: PreguntaService,
        private readonly serieService: SerieService,

    ){}

    async findAll(){
        return this.examenMasterRepository.find({
            where: { estado: true },
        });
    }

    async findById(codigo_master: number){
        const examenMasterExistente = await this.examenMasterRepository.findOne({
            where: { codigo_master, estado: true },
        });

        if (!examenMasterExistente) {
            return new HttpException(
                'El examen-master con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        return examenMasterExistente;
    }

    async createExamenMaster(createExamenMasterDto: CreateExamenMasterDto): Promise<ExamenMaster> {
        const serie_examen = await this.serieExamenRepository.findOne({ where: { codigo_se_ex: createExamenMasterDto.serie_examen } });
        const pregunta = await this.preguntaRepository.findOne({ where: { codigo_pregunta: createExamenMasterDto.pregunta } });
        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: createExamenMasterDto.usuario_ingreso } });
    
        if (!serie_examen) {
            throw new HttpException('Serie de examen no encontrada.', HttpStatus.NOT_FOUND);
        }
    
        if (!pregunta) {
            throw new HttpException('Pregunta no encontrada.', HttpStatus.NOT_FOUND);
        }
    
        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }
    
        const newExamenMaster = this.examenMasterRepository.create({
            serie_examen: serie_examen,
            pregunta: pregunta,
            estado: true,
            usuario_ingreso: usuario,
            fecha_ingreso: new Date(),
            fecha_modifica: null
        });
    
        return this.examenMasterRepository.save(newExamenMaster);
    }

    async updateExamenMaster(codigo_master: number, updateExamenMasterDto: UpdateExamenMasterDto){
        
        const examenMasterExistente = await this.examenMasterRepository.findOne({
            where: { codigo_master },
        });

        if (!examenMasterExistente) {
            return new HttpException(
                'La pregunta-respuesta con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: updateExamenMasterDto.usuario_modifica} });
        const pregunta = await this.preguntaRepository.findOne({ where: { codigo_pregunta: updateExamenMasterDto.pregunta} });
        const serie_examen = await this.serieExamenRepository.findOne({ where: { codigo_se_ex: updateExamenMasterDto.serie_examen} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!pregunta) {
            throw new HttpException('Pregunta no encontrada.', HttpStatus.NOT_FOUND);
        }

        examenMasterExistente.serie_examen = serie_examen;
        examenMasterExistente.pregunta = pregunta;
        examenMasterExistente.usuario_modifica = usuario;
        examenMasterExistente.fecha_modifica = new Date();

        return this.examenMasterRepository.save(examenMasterExistente);  

    }

    async desactiveExamenMaster(codigo_master: number){
        const examenMasterExistente = await this.examenMasterRepository.findOne({
            where: { codigo_master },
        });

        if (!examenMasterExistente) {
            return new HttpException(
                'La pregunta-respuesta con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        examenMasterExistente.estado = false;

        return this.examenMasterRepository.save(examenMasterExistente);
    }

    async createExamen(createExamenMasterDto: ExamenMasterDto) {
      // Buscar el tipo de examen
      const tipoExamen = await this.tipoExamenRepository.findOne({
        where: { codigo_tipoE: createExamenMasterDto.tipo_examen },
      });
      if (!tipoExamen) {
        throw new HttpException('El tipo de examen no encontrado.', HttpStatus.NOT_FOUND);
      }
    
      // Buscar el usuario que crea el examen
      const usuario = await this.usuarioRepository.findOne({
        where: { nombre_usuario: createExamenMasterDto.usuario_ingreso },
      });
      if (!usuario) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      const motivo = await this.motivoRepository.findOne({
        where: { codigo_motivo: createExamenMasterDto.motivo },
      });
    
      // Crear y guardar el nuevo examen
      const newExamen = this.examenRepository.create({
        fecha_evaluacion: createExamenMasterDto.fecha_evaluacion,
        estado: true,
        tipo_examen: tipoExamen,
        motivo_examen: motivo,
        punteo_maximo: createExamenMasterDto.punteo_maximo,
        usuario_ingreso: usuario, // Usamos el usuario encontrado
        fecha_ingreso: new Date(), // Asegurar que la fecha es en formato ISO 8601
        fecha_modifica: null,
      });
    
      const examen = await this.examenRepository.save(newExamen);
    
      const seriesData = [];
    
      // Iterar sobre las series
      for (const serieExamenDto of createExamenMasterDto.series) {
        // Buscar la serie
        const serie = await this.serieRepository.findOne({
          where: { codigo_serie: serieExamenDto.serie },
        });
        if (!serie) {
          throw new NotFoundException(`Serie con ID ${serieExamenDto.serie} no encontrada`);
        }
    
        // Crear la relación serie-examen
        const serieExamen = await this.serieExamenService.createSerieExamen({
          serie: serie.codigo_serie,
          examen: examen.codigo_examen,
          usuario_ingreso: usuario.nombre_usuario, // Usamos el mismo usuario encontrado
        });
    
        const preguntasData = [];
    
        // Iterar sobre las preguntas de la serie
        for (const preguntaIdDto of serieExamenDto.preguntas) {
          // Buscar cada pregunta
          const pregunta = await this.preguntasService.findById(preguntaIdDto.pregunta);
          if (!pregunta) {
            throw new NotFoundException(`Pregunta con ID ${preguntaIdDto.pregunta} no encontrada`);
          }
    
          preguntasData.push(pregunta);
    
          // Crear cada registro en examen-master
          const examenMasterData = {
            serie_examen: serieExamen.codigo_se_ex,
            pregunta: pregunta['codigo_pregunta'],
            usuario_ingreso: usuario.nombre_usuario, // Usamos el usuario para cada registro de examen master
            fecha_ingreso: new Date(), // Asegurar que la fecha es en formato ISO 8601
          };
          await this.createExamenMaster(examenMasterData);
        }
    
        // Agregar los datos de la serie y las preguntas asociadas
        seriesData.push({
          serie,
          serieExamen,
          preguntas: preguntasData,
        });
      }
    
      // Retornar el examen con todas las series y preguntas
      return new ExamenMasterDto(
        tipoExamen.codigo_tipoE,
        examen.fecha_evaluacion,
        examen.punteo_maximo,
        examen.estado,
        seriesData,

      );
    }
  
    async getExamenDetail(codigo_examen: number) {

        const examen = await this.examenRepository.findOne({
          where: { codigo_examen: codigo_examen },
          relations: ['tipo_examen', 'motivo_examen'],
        });
      
        if (!examen) {
          throw new NotFoundException(`Examen con ID ${codigo_examen} no encontrado`);
        }
      
        const seriesExamen = await this.serieExamenRepository.find({
          where: { examen: examen},
          relations: ['serie'],
        });
      
        const result = {
          fecha_evaluacion: examen.fecha_evaluacion,
          tipo_examen: examen.tipo_examen.description,
          motivo_examen: examen.motivo_examen.nombre_motivo,
          ceom: examen.tipo_examen.ceom,
          punteo_maximo: examen.punteo_maximo,
          series: [],
        };
      
        for (const serieExamen of seriesExamen) {

          const preguntasExamenMaster = await this.examenMasterRepository.find({
            where: { serie_examen: serieExamen},
            relations: ['pregunta'],
          });
      
          const serieData = {
            serie: serieExamen.serie.nombre,
            instrucciones: serieExamen.serie.instrucciones,
            preguntas: [],
          };
      
          for (const examenMaster of preguntasExamenMaster) {

            const preguntaRespuestas = await this.preguntaRespuestaRepository.find({
              where: { pregunta: examenMaster.pregunta},
              relations: ['respuesta'],
            });
      
            const preguntaData = {
              descripcion_pregunta: examenMaster.pregunta.descripcion,
              punteo_pregunta: examenMaster.pregunta.punteo,
              respuestas: preguntaRespuestas.map(pr => ({
                descripcion_respuesta: pr.respuesta.respuesta,
                esCorrecta: pr.respuesta.esCorrecta,
              })),
            };
      
            serieData.preguntas.push(preguntaData);
          }
      
          result.series.push(serieData);
        }
      
        return result;
      }

      async updateExamen(codigo_examen: number, updateExamenMasterDto: ExamenMasterDto) {
        // Buscar el examen a actualizar
        const examen = await this.examenRepository.findOne({
            where: { codigo_examen },
            relations: ['tipo_examen'],
        });
        if (!examen) {
            throw new HttpException('Examen no encontrado.', HttpStatus.NOT_FOUND);
        }
    
        // Buscar el tipo de examen
        const tipoExamen = await this.tipoExamenRepository.findOne({
            where: { codigo_tipoE: updateExamenMasterDto.tipo_examen },
        });
        if (!tipoExamen) {
            throw new HttpException('El tipo de examen no encontrado.', HttpStatus.NOT_FOUND);
        }
    
        // Buscar el usuario que actualiza el examen
        const usuario = await this.usuarioRepository.findOne({
            where: { nombre_usuario: updateExamenMasterDto.usuario_ingreso },
        });
        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        // Buscar el motivo del examen
        const motivo = await this.motivoRepository.findOne({
            where: { codigo_motivo: updateExamenMasterDto.motivo },
        });

        if (!motivo) {
            throw new HttpException('Motivo no encontrado.', HttpStatus.NOT_FOUND);
        }
    
        // Actualizar los campos del examen
        examen.fecha_evaluacion = updateExamenMasterDto.fecha_evaluacion;
        examen.punteo_maximo = updateExamenMasterDto.punteo_maximo;
        examen.tipo_examen = tipoExamen;
        examen.motivo_examen = motivo;
        examen.usuario_modifica = usuario;
        examen.fecha_modifica = new Date();
    
        // Guardar los cambios del examen
        await this.examenRepository.save(examen);
    
        // Obtener las series ya existentes para este examen
        const existingSeries = await this.serieExamenRepository.find({
            where: { examen: { codigo_examen } },
        });
    
        // Mapa para llevar control de qué series y preguntas se deben eliminar o actualizar
        const seriesToKeep = new Set<number>();
        const preguntasToKeep = new Set<number>();
    
        // Procesar las series y preguntas del DTO
        for (const serieExamenDto of updateExamenMasterDto.series) {
            // Verificar si la serie ya existe
            let serieExamen = existingSeries.find(
                (s) => s?.serie && s.serie.codigo_serie === serieExamenDto.serie
            );
    
            if (serieExamen) {
                // Si la serie ya existe, actualizamos su relación con el examen
                seriesToKeep.add(serieExamen.codigo_se_ex);
            } else {
                // Si la serie no existe, la creamos
                const serie = await this.serieRepository.findOne({
                    where: { codigo_serie: serieExamenDto.serie },
                });
                if (!serie) {
                    throw new NotFoundException(`Serie con ID ${serieExamenDto.serie} no encontrada`);
                }
    
                // Crear la relación serie-examen
                serieExamen = await this.serieExamenService.createSerieExamen({
                    serie: serie.codigo_serie,
                    examen: examen.codigo_examen,
                    usuario_ingreso: usuario.nombre_usuario,
                });
            }
    
            // Procesar las preguntas de la serie
            for (const preguntaIdDto of serieExamenDto.preguntas) {
                // Verificar si la pregunta ya existe en la relación examen-master
                const existingPregunta = await this.examenMasterRepository.findOne({
                    where: {
                        serie_examen: { codigo_se_ex: serieExamen.codigo_se_ex }, // Asegurarse de usar el código correcto de la relación
                        pregunta: { codigo_pregunta: preguntaIdDto.pregunta }, // Asegurarse de usar el campo correcto
                    },
                });
    
                if (existingPregunta) {
                    // Si la pregunta ya existe, la mantenemos
                    preguntasToKeep.add(existingPregunta.codigo_master);
                } else {
                    // Si la pregunta no existe, la creamos
                    const pregunta = await this.preguntasService.findById(preguntaIdDto.pregunta);
                    if (!(pregunta instanceof Pregunta)) {
                        throw new NotFoundException(`Pregunta con ID ${preguntaIdDto.pregunta} no encontrada`);
                    }
    
                    await this.createExamenMaster({
                        serie_examen: serieExamen.codigo_se_ex,
                        pregunta: pregunta.codigo_pregunta,
                        usuario_ingreso: usuario.nombre_usuario,
                    });
                }
            }
        }
    
        // Eliminar las series y preguntas que ya no existen en el DTO
        for (const serieExamen of existingSeries) {
            if (!seriesToKeep.has(serieExamen.codigo_se_ex)) {
                // Eliminar las preguntas asociadas a esta serie
                await this.examenMasterRepository.delete({ serie_examen: serieExamen });
    
                // Eliminar la relación serie-examen
                await this.serieExamenRepository.delete(serieExamen.codigo_se_ex);
            } else {
                // Eliminar las preguntas que ya no están en la serie
                await this.examenMasterRepository.delete({
                    serie_examen: serieExamen,
                    codigo_master: In([...preguntasToKeep]),
                });
            }
        }
    
        // Retornar el examen actualizado
        return new ExamenMasterDto(
            tipoExamen.codigo_tipoE,
            examen.fecha_evaluacion,
            examen.punteo_maximo,
            examen.estado,
            Array.from(seriesToKeep).map((serieId) => {
                return {
                    serie: serieId,
                    preguntas: Array.from(preguntasToKeep).map((preguntaId) => {
                        return {
                            pregunta: preguntaId, // Crear un objeto PreguntaIdDto
                        };
                    }),
                };
            })
        );
    }
    
    async anularExamen(codigo_examen: number) {
      // Buscar el examen a anular
      const examen = await this.examenRepository.findOne({
          where: { codigo_examen },
          relations: ['tipo_examen'], // No buscamos series aquí
      });
      if (!examen) {
          throw new HttpException('Examen no encontrado.', HttpStatus.NOT_FOUND);
      }
  
      // Cambiar el estado del examen a "false"
      examen.estado = false;
      examen.fecha_modifica = new Date();
      await this.examenRepository.save(examen);
  
      // Obtener las series-examen relacionadas a través del repositorio de SerieExamen
      const seriesExamen = await this.serieExamenRepository.find({
          where: { examen: { codigo_examen } }, // Aquí es donde obtenemos las series relacionadas
      });
  
      // Cambiar el estado de cada serie-examen a "false"
      for (const serieExamen of seriesExamen) {
          serieExamen.estado = false;
          serieExamen.fecha_modifica = new Date();
          await this.serieExamenRepository.save(serieExamen);
  
          // Cambiar el estado de cada examen-master relacionado a "false"
          const examenMasterRecords = await this.examenMasterRepository.find({
              where: { serie_examen: { codigo_se_ex: serieExamen.codigo_se_ex } }, // Usar el código correcto de la relación serie-examen
          });
  
          for (const examenMaster of examenMasterRecords) {
              examenMaster.estado = false;
              examenMaster.fecha_modifica = new Date();
              await this.examenMasterRepository.save(examenMaster);
          }
      }
  
      return {
          message: 'Examen, series y preguntas anulados correctamente',
          codigo_examen: examen.codigo_examen,
      };
  }
}
