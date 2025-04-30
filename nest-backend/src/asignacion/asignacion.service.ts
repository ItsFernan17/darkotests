import { CreateAsignacionDto, } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Asignacion } from './model/asignacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Examen } from 'src/examen/model/examen.entity'; // Asegúrate de ajustar la ruta
import { UserActiveI } from 'src/common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';

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
        relations: ['evaluado', 'examen', 'examen.motivo_examen', 'examen.tipo_examen'],
      });
    }
    return await this.asignacionRepository.find({
      where: { evaluado: { dpi: user.dpi }, estado: true }, 
      relations: ['evaluado', 'examen', 'examen.motivo_examen', 'examen.tipo_examen'], 
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

    const usuarioEvaluado = await this.usuarioRepository.findOne({
      where: { dpi: createAsignacionDto.evaluado, estado: true },
    });
  
    // Buscar el examen por el código proporcionado
    const examen = await this.examenRepository.findOne({
      where: { codigo_examen: createAsignacionDto.examen },
    });
  
    if (!usuarioEvaluado) {
      throw new HttpException('Evaluado no encontrado.', HttpStatus.NOT_FOUND);
    }
  
    if (!examen) {
      throw new HttpException('Examen no encontrado.', HttpStatus.NOT_FOUND);
    }
  
    // Verificar si el usuario ya tiene asignado el examen
    const asignacionExistente = await this.asignacionRepository.findOne({
      where: {
        evaluado: usuarioEvaluado,
        examen: examen,
      },
    });
  
    if (asignacionExistente) {
      throw new HttpException('El evaluado ya tiene este examen asignado.', HttpStatus.CONFLICT);
    }
  
    // Crear nueva asignación
    const newAsignacion = this.asignacionRepository.create({
      estado: true,
      evaluado: usuarioEvaluado,
      punteo: null,
      examen,
      usuario_ingreso: usuarioEvaluado,
      fecha_ingreso: new Date(),
      fecha_modifica: null,
    });
  
    return this.asignacionRepository.save(newAsignacion);
  }
  
  async updateAsignacion(
    codigo_asignacion: number,
    updateAsignacionDto: UpdateAsignacionDto,
  ) {
    const asignacionExistente = await this.asignacionRepository.findOne({
      where: { codigo_asignacion },
    });

    if (!asignacionExistente) {
      throw new HttpException(
        'La asignación con el código proporcionado no existe en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Si el DTO incluye el DPI del evaluado, actualizamos el evaluado por DPI
    if (updateAsignacionDto.evaluado) {
      const usuarioEvaluado = await this.usuarioRepository.findOne({
        where: { dpi: updateAsignacionDto.evaluado },
      });

      if (!usuarioEvaluado) {
        throw new HttpException('Evaluado no encontrado.', HttpStatus.NOT_FOUND);
      }

      asignacionExistente.evaluado = usuarioEvaluado;
    }

    // Actualizar el usuario que modifica
    if (updateAsignacionDto.usuario_modifica) {
      const usuarioModifica = await this.usuarioRepository.findOne({
        where: { nombre_usuario: updateAsignacionDto.usuario_modifica },
      });

      if (!usuarioModifica) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      asignacionExistente.usuario_modifica = usuarioModifica;
      asignacionExistente.fecha_modifica = new Date();
    }

    // Actualizar el examen
    if (updateAsignacionDto.evaluacion) {
      const examen = await this.examenRepository.findOne({
        where: { codigo_examen: updateAsignacionDto.evaluacion },
      });

      if (!examen) {
        throw new HttpException('Examen no encontrado.', HttpStatus.NOT_FOUND);
      }

      asignacionExistente.examen = examen;
    }

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
            'evaluado.comando'
        ],
    });

    if (!asignacion) {
        throw new HttpException('Asignación no encontrada.', HttpStatus.NOT_FOUND);
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
            residencia: asignacion.evaluado?.residencia?.nombre_departamento || null,
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
