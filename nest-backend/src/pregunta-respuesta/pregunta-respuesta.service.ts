import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PreguntaRespuesta } from './model/pregunta-respuesta.entity';
import { CreatePreguntaRespuestaDto, UpdatePreguntaRespuestaDto } from './dto';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Pregunta } from 'src/pregunta/model/pregunta.entity';
import { Respuesta } from 'src/respuesta/model/respuesta.entity';
import { PreguntaService } from 'src/pregunta/pregunta.service';
import { RespuestaService } from 'src/respuesta/respuesta.service';
import { CreatePreguntaDto, UpdatePreguntaDto } from 'src/pregunta/dto';
import { CreateRespuestaDto, UpdateRespuestaDto } from 'src/respuesta/dto';
import { TipoPregunta } from 'src/seed-db/tipo-pregunta/model/tipo-pregunta.entity';

@Injectable()
export class PreguntaRespuestaService {

    constructor(
        @InjectRepository(PreguntaRespuesta)
        private preguntaRespuestaRepository: Repository<PreguntaRespuesta>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Pregunta)
        private preguntaRepository: Repository<Pregunta>,
        @InjectRepository(Respuesta)
        private respuestaRepository: Repository<Respuesta>,
        private readonly preguntaService: PreguntaService,
        private readonly respuestaService: RespuestaService,
        @InjectRepository(TipoPregunta)
        private tipoPreguntaRepository: Repository<TipoPregunta>,

    ){}

    async findAll() {
        return this.preguntaRespuestaRepository.find({
            where: { estado: true },
            relations: ['pregunta', 'respuesta', 'tipo_pregunta'],
        });
    }

    // Buscar una relación por su ID
    async findById(codigo_pre_res: number) {
        const preguntaRespuestaExistente = await this.preguntaRespuestaRepository.findOne({
            where: { codigo_pre_res, estado: true },
            relations: ['pregunta', 'respuesta'],
        });

        if (!preguntaRespuestaExistente) {
            throw new HttpException(
                'La relación Pregunta-Respuesta con el código proporcionado no existe.',
                HttpStatus.NOT_FOUND,
            );
        }

        return preguntaRespuestaExistente;
    }

    async createPreguntaRespuesta(createPreguntaRespuestaDto: CreatePreguntaRespuestaDto){

        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: createPreguntaRespuestaDto.usuario_ingreso} });
        const pregunta = await this.preguntaRepository.findOne({ where: { codigo_pregunta: createPreguntaRespuestaDto.pregunta} });
        const respuesta = await this.respuestaRepository.findOne({ where: { codigo_respuesta: createPreguntaRespuestaDto.respuesta} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!pregunta) {
            throw new HttpException('Pregunta no encontrada.', HttpStatus.NOT_FOUND);
        }

        if (!respuesta) {
            throw new HttpException('Respuesta no encontrada.', HttpStatus.NOT_FOUND);
        }

        const newPreguntaRespuesta = this.preguntaRespuestaRepository.create({
            pregunta: pregunta,
            respuesta: respuesta,
            estado: true,
            usuario_ingreso: usuario,
            fecha_ingreso: new Date(),
            fecha_modifica: null,
        });

        return this.preguntaRespuestaRepository.save(newPreguntaRespuesta);
    }

    async updatePreguntaRespuesta(codigo_pre_res: number, updatePreguntaRespuestaDto: UpdatePreguntaRespuestaDto){
        const preguntaRespuestaExistente = await this.preguntaRespuestaRepository.findOne({
            where: { codigo_pre_res },
        });

        if (!preguntaRespuestaExistente) {
            return new HttpException(
                'La pregunta-respuesta con el código proporcionado no existe en la base de datos.',
                HttpStatus.NOT_FOUND,
            );
        }

        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: updatePreguntaRespuestaDto.usuario_modifica} });
        const pregunta = await this.preguntaRepository.findOne({ where: { codigo_pregunta: updatePreguntaRespuestaDto.pregunta} });
        const respuesta = await this.respuestaRepository.findOne({ where: { codigo_respuesta: updatePreguntaRespuestaDto.respuesta} });

        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }

        if (!pregunta) {
            throw new HttpException('Pregunta no encontrada.', HttpStatus.NOT_FOUND);
        }

        if (!respuesta) {
            throw new HttpException('Respuesta no encontrada.', HttpStatus.NOT_FOUND);
        }

        preguntaRespuestaExistente.pregunta = pregunta;
        preguntaRespuestaExistente.respuesta = respuesta;
        preguntaRespuestaExistente.usuario_modifica = usuario;      
        preguntaRespuestaExistente.fecha_modifica = new Date();

        return this.preguntaRespuestaRepository.save(preguntaRespuestaExistente);
    }


    async registerPreguntasConRespuestas(preguntasConRespuestas: { pregunta: CreatePreguntaDto, respuestas: CreateRespuestaDto[] }[]): Promise<Pregunta[]> {
        //Con este método se registran multiples preguntas con sus respectivas respuestas
        const preguntas: Pregunta[] = [];
    
        for (const item of preguntasConRespuestas) {
            const { pregunta, respuestas } = item;
    
            // Verifica si la pregunta ya existe por su contenido
            let createdPregunta = await this.preguntaService.findByPregunta(pregunta.descripcion);
            if (createdPregunta) {
                // Lanza un error HTTP si la pregunta ya existe
                throw new HttpException(`La pregunta "${pregunta.descripcion}" ya existe.`, HttpStatus.BAD_REQUEST);
            }
    
            // Crea la pregunta si no existe
            createdPregunta = await this.preguntaService.createPregunta(pregunta);
    
            // Crea las respuestas y las asocia a la pregunta
            for (const createRespuestaDto of respuestas) {
                // Verifica si la respuesta ya existe por su contenido
                let respuesta = await this.respuestaService.findByRespuesta(createRespuestaDto.respuesta);
    
                if (!respuesta) {
                    // Crea la respuesta si no existe
                    respuesta = await this.respuestaService.createRespuesta(createRespuestaDto);
                }
    
                // Verifica si la respuesta ya está asociada a la pregunta
                const existingAssociation = await this.preguntaRespuestaRepository.findOne({
                    where: {
                        pregunta: { codigo_pregunta: createdPregunta.codigo_pregunta },
                        respuesta: { codigo_respuesta: respuesta.codigo_respuesta },
                    },
                });
    
                if (!existingAssociation) {
                    // Asocia la respuesta a la pregunta
                    const createPreguntaRespuestaDto: CreatePreguntaRespuestaDto = {
                        pregunta: createdPregunta.codigo_pregunta,
                        respuesta: respuesta.codigo_respuesta,
                        usuario_ingreso: pregunta.usuario_ingreso,
                    };
                    await this.createPreguntaRespuesta(createPreguntaRespuestaDto);
                }
            }
    
            preguntas.push(createdPregunta);
        }
    
        return preguntas;
    }

    async findPreguntasRespuestas() {
        const preguntas = await this.preguntaRespuestaRepository.find({
            where: { estado: true },
            relations: ['pregunta', 'respuesta', 'pregunta.tipo_pregunta'],
        });
    
        // Agrupar respuestas por pregunta
        const preguntasMap = new Map();
    
        preguntas.forEach(pr => {
            const preguntaId = pr.pregunta.codigo_pregunta;
            if (!preguntasMap.has(preguntaId)) {
                preguntasMap.set(preguntaId, {
                    codigo_pregunta: pr.pregunta.codigo_pregunta,
                    descripcion: pr.pregunta.descripcion,
                    tipo_pregunta: pr.pregunta.tipo_pregunta?.descripcion || 'Sin tipo',
                    punteo: pr.pregunta.punteo,
                    respuestas: []
                });
            }
            preguntasMap.get(preguntaId).respuestas.push({
                respuesta: pr.respuesta.respuesta,
                esCorrecta: pr.respuesta.esCorrecta ? 'Correcta' : 'Incorrecta'
            });
        });
    
        // Convertir el mapa a un array
        const result = Array.from(preguntasMap.values());
    
        return result;
    }

    async findPreguntaById(codigo_pregunta: number): Promise<any> {
        // Buscar la relación en la tabla pregunta-respuesta que esté activa
        const relaciones = await this.preguntaRespuestaRepository.find({
            where: { pregunta: { codigo_pregunta }, estado: true }, // Relaciones activas por el ID de la pregunta
            relations: ['pregunta', 'respuesta'],
        });
    
        if (!relaciones || relaciones.length === 0) {
            throw new HttpException(`La pregunta con ID ${codigo_pregunta} no existe o está desactivada.`, HttpStatus.NOT_FOUND);
        }
    
        // Extraer la pregunta (suponemos que todas las relaciones tienen la misma pregunta)
        const pregunta = relaciones[0].pregunta;
    
        // Formatear las respuestas asociadas a la pregunta
        const respuestas = relaciones.map(relacion => ({
            respuesta: relacion.respuesta.respuesta,
            esCorrecta: relacion.respuesta.esCorrecta ? 'Correcta' : 'Incorrecta',
        }));
    
        // Retornar la pregunta con las respuestas
        return {
            descripcion: pregunta.descripcion,
            punteo: pregunta.punteo,
            respuestas,
        };
    }


    async desactivePreguntaRespuesta(codigo_pregunta: number): Promise<any[]> {
        // Buscar las relaciones en la tabla pregunta-respuesta que estén activas
        const relaciones = await this.preguntaRespuestaRepository.find({
            where: { pregunta: { codigo_pregunta }, estado: true }, // Solo relaciones activas
            relations: ['pregunta', 'respuesta'],
        });
    
        if (!relaciones || relaciones.length === 0) {
            throw new HttpException(`La pregunta con ID ${codigo_pregunta} no existe o ya fue desactivada.`, HttpStatus.NOT_FOUND);
        }
    
        // Desactivar las relaciones y las entidades relacionadas
        for (const relacion of relaciones) {
            // Desactivar la relación (pregunta-respuesta)
            relacion.estado = false;
            await this.preguntaRespuestaRepository.save(relacion);
    
            // Desactivar la pregunta si aún no ha sido desactivada
            if (relacion.pregunta.estado !== false) {
                relacion.pregunta.estado = false;
                await this.preguntaRepository.save(relacion.pregunta);
            }
    
            // Desactivar la respuesta si aún no ha sido desactivada
            if (relacion.respuesta.estado !== false) {
                relacion.respuesta.estado = false;
                await this.respuestaRepository.save(relacion.respuesta);
            }
        }
    
        // Retornar un array vacío cuando se complete la operación
        return [];
    }

    async updatePreguntaYRespuestas(
        codigo_pregunta: number,
        updatePreguntaDto: UpdatePreguntaDto,
        updateRespuestasDto: { respuesta: string, esCorrecta: boolean, usuario_modifica: string }[]
    ) {
        // Buscar la pregunta en la base de datos
        const preguntaExistente = await this.preguntaRepository.findOne({
            where: { codigo_pregunta, estado: true },
        });
    
        if (!preguntaExistente) {
            throw new HttpException(`La pregunta con ID ${codigo_pregunta} no existe o está desactivada.`, HttpStatus.NOT_FOUND);
        }
    
        const usuario = await this.usuarioRepository.findOne({ where: { nombre_usuario: updatePreguntaDto.usuario_modifica } });
    
        if (!usuario) {
            throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
        }
    
        // Verificar si el tipo de pregunta está en el DTO y actualizarlo
        if (updatePreguntaDto.tipo_pregunta) {
            const tipoPregunta = await this.tipoPreguntaRepository.findOne({
                where: { codigo_tipoP: updatePreguntaDto.tipo_pregunta },
            });
    
            if (!tipoPregunta) {
                throw new HttpException(`El tipo de pregunta con ID ${updatePreguntaDto.tipo_pregunta} no existe.`, HttpStatus.NOT_FOUND);
            }
    
            preguntaExistente.tipo_pregunta = tipoPregunta; // Actualizar el tipo de pregunta
        }
    
        // Actualizar la pregunta con los nuevos datos
        preguntaExistente.descripcion = updatePreguntaDto.descripcion;
        preguntaExistente.punteo = updatePreguntaDto.punteo;
        preguntaExistente.usuario_modifica = usuario;
        preguntaExistente.fecha_modifica = new Date();
        await this.preguntaRepository.save(preguntaExistente);
    
        // Obtener todas las relaciones de la pregunta con las respuestas asociadas
        const relacionesExistentes = await this.preguntaRespuestaRepository.find({
            where: { pregunta: { codigo_pregunta: codigo_pregunta }, estado: true },
            relations: ['respuesta'],
        });
    
        // Mapear las respuestas actuales para facilitar su búsqueda
        const respuestasExistentesMap = new Map();
        relacionesExistentes.forEach(relacion => {
            respuestasExistentesMap.set(relacion.respuesta.respuesta, relacion);
        });
    
        // Actualizar respuestas existentes y agregar nuevas respuestas
        for (let i = 0; i < updateRespuestasDto.length; i++) {
            const updateRespuestaDto = updateRespuestasDto[i];
    
            // Verificar si la respuesta ya existe en la relación
            if (respuestasExistentesMap.has(updateRespuestaDto.respuesta)) {
                // Actualizar la respuesta existente
                const relacion = respuestasExistentesMap.get(updateRespuestaDto.respuesta);
                const respuestaExistente = relacion.respuesta;
    
                respuestaExistente.respuesta = updateRespuestaDto.respuesta;
                respuestaExistente.esCorrecta = updateRespuestaDto.esCorrecta;
                respuestaExistente.usuario_modifica = usuario;
                respuestaExistente.fecha_modifica = new Date();
                await this.respuestaRepository.save(respuestaExistente);
    
                // Actualizar la relación si es necesario
                relacion.usuario_modifica = usuario;
                relacion.fecha_modifica = new Date();
                await this.preguntaRespuestaRepository.save(relacion);
    
                // Eliminar del mapa para controlar respuestas no eliminadas
                respuestasExistentesMap.delete(updateRespuestaDto.respuesta);
            } else {
                // Si es una nueva respuesta, creamos una nueva entidad de respuesta
                const nuevaRespuesta = this.respuestaRepository.create({
                    respuesta: updateRespuestaDto.respuesta,
                    esCorrecta: updateRespuestaDto.esCorrecta,
                    usuario_ingreso: usuario,
                    fecha_ingreso: new Date(),
                    estado: true,
                });
                const respuestaCreada = await this.respuestaRepository.save(nuevaRespuesta);
    
                // Crear la nueva relación entre la pregunta y la nueva respuesta
                const nuevaRelacion = this.preguntaRespuestaRepository.create({
                    pregunta: preguntaExistente,
                    respuesta: respuestaCreada,
                    usuario_ingreso: usuario,
                    fecha_ingreso: new Date(),
                    estado: true,
                });
                await this.preguntaRespuestaRepository.save(nuevaRelacion);
            }
        }
    
        // Eliminar relaciones de respuestas que ya no están en el DTO
        for (const [key, relacion] of respuestasExistentesMap.entries()) {
            // Si la respuesta ya no está en el DTO, desactivamos la relación
            relacion.estado = false;
            relacion.usuario_modifica = usuario;
            relacion.fecha_modifica = new Date();
            await this.preguntaRespuestaRepository.save(relacion);
        }
    
        // Retornar la pregunta actualizada con sus respuestas
        const preguntaConRespuestas = await this.findPreguntaById(preguntaExistente.codigo_pregunta);
        return preguntaConRespuestas;
    }  
    


}
