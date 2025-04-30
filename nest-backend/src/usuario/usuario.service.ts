import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto, UpdateUsuarioDto} from './dto';
import { Usuario } from './model/usuario.entity';
import { Departamento } from 'src/seed-db/departamento/model/departamento.entity';
import { Grado } from 'src/seed-db/grado/model/grado.entity';
import { Poblacion } from 'src/seed-db/poblacion/model/poblacion.entity';
import { Comando } from 'src/seed-db/comando/model/comando.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>, 
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
    @InjectRepository(Poblacion)
    private readonly poblacionRepository: Repository<Poblacion>,
    @InjectRepository(Comando)
    private readonly comandoRepository: Repository<Comando>,
  ) { }

  private generateUsername(nombreCompleto: string): string { 
    const partes = nombreCompleto.split(' ');
  
    if (partes.length < 2) {
      throw new Error('El nombre completo debe contener al menos un nombre y un apellido.');
    }
  
    const primerNombre = partes[0];
    const primerApellido = partes.length > 2 ? partes[2] : partes[1];
    
    return `${primerNombre.charAt(0).toLowerCase()}${primerApellido.toLowerCase()}`;
  }

  async findAll() {
    return this.usuarioRepository.find({
      where: { estado: true },
      relations: ['residencia', 'comando', 'poblacion', 'grado'],
      select: {
        residencia: { nombre_departamento: true },
        comando: { nombre_comando: true },
        poblacion: { nombre_poblacion: true },
        grado: { nombre_grado: true },
      },
    });
  }

  async findByUsuarioWithPassword(nombre_usuario: string) {
    return this.usuarioRepository.findOne({
      where: { nombre_usuario, estado: true },
      select: ['dpi', 'nombre_completo', 'nombre_usuario', 'rol', 'password'],
    });
  }

  async findByDPI(dpi: string) {
    return this.usuarioRepository.findOne({
      where: { dpi, estado: true },
      relations: ['residencia', 'comando', 'poblacion', 'grado'],
      select: {
        residencia: { codigo_departamento: true, nombre_departamento: true },
        comando: { nombre_comando: true },
        poblacion: { nombre_poblacion: true },
        grado: { nombre_grado: true },
      },
    });
  }

  async findByUsername(nombre_usuario: string){
    return this.usuarioRepository.findOne({ where: { nombre_usuario, estado: true } });
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto) {
    const nombreUsuario = this.generateUsername(createUsuarioDto.nombre_completo);
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { nombre_usuario: nombreUsuario },
    });
  
    if (usuarioExistente) {
      throw new HttpException('El usuario ya existe en la base de datos.', 409);
    }
  
    const residencia = await this.departamentoRepository.findOne({ where: { codigo_departamento: createUsuarioDto.residencia } });
    const grado = await this.gradoRepository.findOne({ where: { codigo_grado: createUsuarioDto.grado } });
    const poblacion = await this.poblacionRepository.findOne({ where: { codigo_poblacion: createUsuarioDto.poblacion } });
    const comando = await this.comandoRepository.findOne({ where: { codigo_comando: createUsuarioDto.comando } });
  
    if (!residencia) {
      throw new HttpException('Departamento no encontrado.', HttpStatus.NOT_FOUND);
    }
  
    if (!grado) {
      throw new HttpException('Grado no encontrado.', HttpStatus.NOT_FOUND);
    }
  
    if (!poblacion) {
      throw new HttpException('Población no encontrada.', HttpStatus.NOT_FOUND);
    }

    if (!comando) {
      throw new HttpException('Comando no encontrado.', HttpStatus.NOT_FOUND);
    }
  
    const newUsuario = this.usuarioRepository.create({
      estado: true,
      ...createUsuarioDto,
      nombre_usuario: nombreUsuario,
      residencia: residencia,
      grado: grado,
      poblacion: poblacion,
      comando: comando,
    });
  
    return this.usuarioRepository.save(newUsuario);
  }

  async updateUsuario(dpi: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { dpi, estado: true },
    });
  
    if (!usuarioExistente) {
      throw new HttpException(
        'El Usuario con el nombre proporcionado no existe en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    const residencia = await this.departamentoRepository.findOne({ where: { codigo_departamento: updateUsuarioDto.residencia } });
    const grado = await this.gradoRepository.findOne({ where: { codigo_grado: updateUsuarioDto.grado } });
    const poblacion = await this.poblacionRepository.findOne({ where: { codigo_poblacion: updateUsuarioDto.poblacion } });
    const comando = await this.comandoRepository.findOne({ where: { codigo_comando: updateUsuarioDto.comando } });

    if (!residencia) {
      throw new HttpException('Departamento no encontrado.', HttpStatus.NOT_FOUND);
    }

    if (!grado) {
      throw new HttpException('Grado no encontrado.', HttpStatus.NOT_FOUND);
    }

    if (!poblacion) {
      throw new HttpException('Población no encontrada.', HttpStatus.NOT_FOUND);
    }

    if (!comando) {
      throw new HttpException('Comando no encontrado.', HttpStatus.NOT_FOUND);
    }
  

    usuarioExistente.nombre_completo = updateUsuarioDto.nombre_completo || usuarioExistente.nombre_completo;
    usuarioExistente.telefono = updateUsuarioDto.telefono || usuarioExistente.telefono;
    usuarioExistente.rol = updateUsuarioDto.rol || usuarioExistente.rol;
    usuarioExistente.residencia = residencia;
    usuarioExistente.grado = grado;
    usuarioExistente.poblacion = poblacion;
    usuarioExistente.comando = comando;
  
    if (updateUsuarioDto.password) {
      usuarioExistente.password = await bcryptjs.hash(updateUsuarioDto.password, 10);
    }

    const savedUsuario = await this.usuarioRepository.save(usuarioExistente);
  
    const { password, ...result } = savedUsuario;
  
    return result;

  }

  async desactiveUsuario(dpi: string) {
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { dpi },
    });
  
    if (!usuarioExistente) {
      throw new HttpException(
        'El Usuario no existe en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }
  
    usuarioExistente.estado = false;
  
    // Esperar la operación de guardado
    return await this.usuarioRepository.save(usuarioExistente);
  }

}
