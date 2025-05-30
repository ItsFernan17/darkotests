import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { Usuario } from './model/usuario.entity';
import { Departamento } from 'src/seed-db/departamento/model/departamento.entity';
import { Grado } from 'src/seed-db/grado/model/grado.entity';
import { Poblacion } from 'src/seed-db/poblacion/model/poblacion.entity';
import { Comando } from 'src/seed-db/comando/model/comando.entity';
import * as bcryptjs from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { Role } from 'src/common/enums/rol.enum';
import * as sharp from 'sharp';

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
  ) {}

  private generateUsername(nombreCompleto: string): string {
    const partes = nombreCompleto.split(' ');

    if (partes.length < 2) {
      throw new Error(
        'El nombre completo debe contener al menos un nombre y un apellido.',
      );
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

  async findByUsername(nombre_usuario: string) {
    return this.usuarioRepository.findOne({
      where: { nombre_usuario, estado: true },
    });
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto) {
    const nombreUsuario = this.generateUsername(
      createUsuarioDto.nombre_completo,
    );

    // Buscar usuario por DPI (clave única)
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { dpi: createUsuarioDto.dpi },
      relations: ['residencia', 'grado', 'poblacion', 'comando'],
    });

    // Buscar entidades relacionadas
    const residencia = await this.departamentoRepository.findOne({
      where: { codigo_departamento: createUsuarioDto.residencia },
    });
    const grado = await this.gradoRepository.findOne({
      where: { codigo_grado: createUsuarioDto.grado },
    });
    const poblacion = await this.poblacionRepository.findOne({
      where: { codigo_poblacion: createUsuarioDto.poblacion },
    });
    const comando = await this.comandoRepository.findOne({
      where: { codigo_comando: createUsuarioDto.comando },
    });

    if (!residencia) {
      throw new HttpException(
        'Departamento no encontrado.',
        HttpStatus.NOT_FOUND,
      );
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

    // Si ya existe y está inactivo, reactivar
    if (usuarioExistente && usuarioExistente.estado === false) {
      usuarioExistente.nombre_completo = createUsuarioDto.nombre_completo;
      usuarioExistente.telefono = createUsuarioDto.telefono;
      usuarioExistente.rol = createUsuarioDto.rol;
      usuarioExistente.residencia = residencia;
      usuarioExistente.grado = grado;
      usuarioExistente.poblacion = poblacion;
      usuarioExistente.comando = comando;
      usuarioExistente.password = await bcryptjs.hash(
        createUsuarioDto.password,
        10,
      );
      usuarioExistente.nombre_usuario = nombreUsuario;
      usuarioExistente.estado = true;

      return this.usuarioRepository.save(usuarioExistente);
    }

    // Si ya existe y está activo, lanzar error
    if (usuarioExistente && usuarioExistente.estado === true) {
      throw new HttpException('El usuario ya existe en la base de datos.', 409);
    }

    // Crear nuevo usuario si no existe
    const newUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      nombre_usuario: nombreUsuario,
      residencia,
      grado,
      poblacion,
      comando,
      estado: true,
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

    const residencia = await this.departamentoRepository.findOne({
      where: { codigo_departamento: updateUsuarioDto.residencia },
    });
    const grado = await this.gradoRepository.findOne({
      where: { codigo_grado: updateUsuarioDto.grado },
    });
    const poblacion = await this.poblacionRepository.findOne({
      where: { codigo_poblacion: updateUsuarioDto.poblacion },
    });
    const comando = await this.comandoRepository.findOne({
      where: { codigo_comando: updateUsuarioDto.comando },
    });

    if (!residencia) {
      throw new HttpException(
        'Departamento no encontrado.',
        HttpStatus.NOT_FOUND,
      );
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

    usuarioExistente.nombre_completo =
      updateUsuarioDto.nombre_completo || usuarioExistente.nombre_completo;
    usuarioExistente.telefono =
      updateUsuarioDto.telefono || usuarioExistente.telefono;
    usuarioExistente.rol = updateUsuarioDto.rol || usuarioExistente.rol;
    usuarioExistente.residencia = residencia;
    usuarioExistente.grado = grado;
    usuarioExistente.poblacion = poblacion;
    usuarioExistente.comando = comando;

    if (updateUsuarioDto.password) {
      usuarioExistente.password = await bcryptjs.hash(
        updateUsuarioDto.password,
        10,
      );
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

  async uploadFotos(
    dpi: string,
    fotos: {
      foto_frente?: Buffer;
      foto_perfil_derecho?: Buffer;
      foto_perfil_izquierdo?: Buffer;
    },
  ) {
    const usuario = await this.usuarioRepository.findOne({ where: { dpi } });

    if (!usuario) {
      throw new HttpException('El usuario no existe.', HttpStatus.NOT_FOUND);
    }

    if (usuario.rol !== Role.EVALUADO) {
      throw new HttpException(
        'Solo usuarios con rol EVALUADO pueden subir fotos.',
        HttpStatus.FORBIDDEN,
      );
    }

    const basePath = path.resolve('resources', 'pictures');
    const userFolder = path.join(basePath, dpi);

    // Crear carpeta por DPI si no existe
    if (!fs.existsSync(userFolder))
      fs.mkdirSync(userFolder, { recursive: true });

    // Procesamiento y guardado de imagen
    const procesarYGuardar = async (
      buffer: Buffer,
      nombre: string,
    ): Promise<string> => {
      const archivo = `${nombre}.jpg`;
      const rutaFinal = path.join(userFolder, archivo);

      await sharp(buffer)
        .resize(512, 512, { fit: 'cover' })
        .modulate({
          brightness: 1.2,
          saturation: 1.15,
        })
        .linear(1.15, -10)
        .sharpen({ sigma: 1.5 })
        .normalize()
        .jpeg({ quality: 90 })
        .toFile(rutaFinal);

      return `/resources/pictures/${dpi}/${archivo}`; // Ruta relativa
    };

    // Guardar fotos si vienen
    if (fotos.foto_frente) {
      usuario.foto_frente = await procesarYGuardar(fotos.foto_frente, 'frente');
    }

    if (fotos.foto_perfil_derecho) {
      usuario.foto_perfil_derecho = await procesarYGuardar(
        fotos.foto_perfil_derecho,
        'perfil_derecho',
      );
    }

    if (fotos.foto_perfil_izquierdo) {
      usuario.foto_perfil_izquierdo = await procesarYGuardar(
        fotos.foto_perfil_izquierdo,
        'perfil_izquierdo',
      );
    }

    return await this.usuarioRepository.save(usuario);
  }

  async getFotos(dpi: string) {
    console.log('📌 DPI recibido:', dpi);

    const usuario = await this.usuarioRepository.findOne({
      where: { dpi },
      select: {
        foto_frente: true,
        foto_perfil_derecho: true,
        foto_perfil_izquierdo: true,
      },
    });

    if (!usuario) {
      throw new HttpException(
        'El Usuario no existe en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      foto_frente: usuario.foto_frente || null,
      foto_perfil_derecho: usuario.foto_perfil_derecho || null,
      foto_perfil_izquierdo: usuario.foto_perfil_izquierdo || null,
    };
  }
}
// 