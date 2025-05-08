import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Asignacion } from './model/asignacion.entity';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Examen } from 'src/examen/model/examen.entity'; // Asegúrate de ajustar la ruta
import { UserActiveI } from 'src/common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';
import { Not } from 'typeorm';

@Injectable()
export class AsignacionService {
  constructor(
    @InjectRepository(Asignacion)
    private asignacionRepository: Repository<Asignacion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
  ) {}

  async findAll(user: UserActiveI): Promise<Asignacion[]> {
    if (user.rol === Role.ADMINISTRADOR || user.rol === Role.EVALUADOR) {
      return await this.asignacionRepository.find({
        where: { estado: true },
        relations: [
          'evaluado',
          'examen',
          'examen.motivo_examen',
          'examen.tipo_examen',
        ],
      });
    }
    return await this.asignacionRepository.find({
      where: { evaluado: { dpi: user.dpi }, estado: true },
      relations: [
        'evaluado',
        'examen',
        'examen.motivo_examen',
        'examen.tipo_examen',
      ],
    });
  }

  async findById(codigo_asignacion: number) {
    const asignacionExistente = await this.asignacionRepository.findOne({
      where: { codigo_asignacion },
      relations: ['evaluado', 'examen'],
    });

    if (!asignacionExistente) {
      return new HttpException(
        'La asignación con el código proporcionado no existe en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    return asignacionExistente;
  }

  async createAsignacion(createAsignacionDto: CreateAsignacionDto) {
    const { evaluados, examen: codigoExamen } = createAsignacionDto;

    // Buscar el examen una sola vez
    const examen = await this.examenRepository.findOne({
      where: { codigo_examen: codigoExamen },
    });

    if (!examen) {
      throw new HttpException('Examen no encontrado.', HttpStatus.NOT_FOUND);
    }

    //Buscar el usuario que crea la asignacion
    const usuarioIngreso = await this.usuarioRepository.findOne({
      where: { dpi: createAsignacionDto.usuario_ingreso },
    });

    if (!usuarioIngreso) {
      throw new HttpException(
        'El usuario que crea la asignación no existe.',
        HttpStatus.NOT_FOUND,
      );
    }

    const asignacionesCreadas = [];

    for (const dpi of evaluados) {
      const usuarioEvaluado = await this.usuarioRepository.findOne({
        where: { dpi, estado: true },
      });

      if (!usuarioEvaluado) {
        // Puedes seguir con los demás o lanzar error directamente
        continue; // O usar: throw new HttpException(`Evaluado con DPI ${dpi} no encontrado.`, HttpStatus.NOT_FOUND);
      }

      const asignacionExistente = await this.asignacionRepository.findOne({
        where: {
          evaluado: usuarioEvaluado,
          examen: examen,
          estado: true,
        },
      });

      if (asignacionExistente) {
        throw new HttpException(
          `Los evaluados ya poseen una asignación para este examen.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar si el evaluado ya tiene una asignación para el examen pero no está activo que la active mediente el codigo de asignación
      const asignacionInactiva = await this.asignacionRepository.findOne({
        where: {
          evaluado: usuarioEvaluado,
          examen: examen,
          estado: false,
        },
      });

      if (asignacionInactiva) {
        asignacionInactiva.estado = true;
        asignacionesCreadas.push(asignacionInactiva);
        await this.asignacionRepository.save(asignacionInactiva);
      } else {
        const nuevaAsignacion = this.asignacionRepository.create({
          evaluado: usuarioEvaluado, // Usuario completo
          examen: examen, // Examen completo
          usuario_ingreso: usuarioIngreso, // Usuario completo, no string
          fecha_ingreso: new Date(),
          estado: true,
          punteo: null,
        });
        asignacionesCreadas.push(nuevaAsignacion);
        await this.asignacionRepository.save(nuevaAsignacion);
      }
    }
    return asignacionesCreadas;
  }

  async updateAsignacion(codigo_asignacion: number, updateAsignacionDto: UpdateAsignacionDto) {
    const { evaluado, evaluacion, usuario_modifica } = updateAsignacionDto;
  
    // Verificar si la asignación actual existe y traer el examen actual
    const asignacionExistente = await this.asignacionRepository.findOne({
      where: { codigo_asignacion },
      relations: ['examen'], // 👈 Necesario para comparar examen actual
    });
  
    if (!asignacionExistente) {
      throw new NotFoundException('La asignación no existe.');
    }
  
    // ✅ Verificar si se intenta asignar el mismo examen (actualización redundante)
    if (asignacionExistente.examen.codigo_examen === evaluacion) {
      throw new BadRequestException('Esta asignación ya tiene asignado ese examen.');
    }
  
    // ✅ Verificar si hay otra asignación activa con el mismo examen y evaluado
    const yaAsignado = await this.asignacionRepository
      .createQueryBuilder('asignacion')
      .where('asignacion.evaluado = :dpi', { dpi: evaluado })
      .andWhere('asignacion.examen = :examen', { examen: evaluacion })
      .andWhere('asignacion.estado = 1') // ⚠ estado tipo BIT(1)
      .andWhere('asignacion.codigo_asignacion != :actual', { actual: codigo_asignacion })
      .getOne();
  
    if (yaAsignado) {
      throw new BadRequestException(
        'El evaluado ya tiene una asignación activa con ese examen.'
      );
    }
  
    // Cargar objetos completos para asignar
    const examenObj = await this.examenRepository.findOne({ where: { codigo_examen: evaluacion } });
    const evaluadoObj = await this.usuarioRepository.findOne({ where: { dpi: evaluado } });
    const usuarioModificaObj = await this.usuarioRepository.findOne({ where: { dpi: usuario_modifica } });
  
    if (!examenObj || !evaluadoObj || !usuarioModificaObj) {
      throw new NotFoundException('Datos de examen, evaluado o usuario modificador no válidos.');
    }
  
    // Actualizar asignación
    asignacionExistente.examen = examenObj;
    asignacionExistente.evaluado = evaluadoObj;
    asignacionExistente.usuario_modifica = usuarioModificaObj;
    asignacionExistente.fecha_modifica = new Date();
  
    return this.asignacionRepository.save(asignacionExistente);
  }
  
  async desactiveAsignacion(codigo_asignacion: number) {
    const asignacionExistente = await this.asignacionRepository.findOne({
      where: { codigo_asignacion },
    });

    if (!asignacionExistente) {
      return new HttpException(
        'La asignación con el código proporcionado no existe en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    asignacionExistente.estado = false;

    return this.asignacionRepository.save(asignacionExistente);
  }

  async getAsignacionConDatos(codigo_asignacion: number) {
    const asignacion = await this.asignacionRepository.findOne({
      where: { codigo_asignacion },
      relations: [
        'evaluado',
        'examen',
        'examen.motivo_examen',
        'examen.tipo_examen',
        'evaluado.grado',
        'evaluado.poblacion',
        'evaluado.residencia',
        'evaluado.comando',
      ],
    });

    if (!asignacion) {
      throw new HttpException(
        'Asignación no encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      codigo_asignacion: asignacion.codigo_asignacion,
      estado: asignacion.estado,
      punteo: asignacion.punteo,
      evaluado: {
        dpi: asignacion.evaluado?.dpi || null,
        nombre_completo: asignacion.evaluado?.nombre_completo || null,
        telefono: asignacion.evaluado?.telefono || null,
        grado: asignacion.evaluado?.grado?.nombre_grado || null,
        poblacion: asignacion.evaluado?.poblacion?.nombre_poblacion || null,
        residencia:
          asignacion.evaluado?.residencia?.nombre_departamento || null,
        comando: asignacion.evaluado?.comando?.nombre_comando || null,
      },
      examen: {
        codigo_examen: asignacion.examen.codigo_examen,
        fecha_evaluacion: asignacion.examen.fecha_evaluacion,
        punteo_maximo: asignacion.examen.punteo_maximo,
        tipo_examen: asignacion.examen.tipo_examen?.description || null,
        motivo_examen: asignacion.examen.motivo_examen?.nombre_motivo || null,
      },
    };
  }

  async updatePunteo(codigo_asignacion: number, punteo: number) {
    const asignacionExistente = await this.asignacionRepository.findOne({
      where: { codigo_asignacion },
    });

    if (!asignacionExistente) {
      throw new HttpException(
        'La asignación con el código proporcionado no existe en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    asignacionExistente.punteo = punteo;

    return this.asignacionRepository.save(asignacionExistente);
  }
}
