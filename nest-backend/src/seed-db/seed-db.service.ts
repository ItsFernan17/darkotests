import { Injectable, OnModuleInit } from '@nestjs/common';
import { DepartamentoService } from './departamento/departamento.service';
import { initialData } from './data/seed-db.data';
import { GradoService } from './grado/grado.service';
import { PoblacionService } from './poblacion/poblacion.service';
import { MotivoService } from './motivo/motivo.service';
import { ComandoService } from './comando/comando.service';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './departamento/model/departamento.entity';
import { Grado } from './grado/model/grado.entity';
import { Poblacion } from './poblacion/model/poblacion.entity';
import { Comando } from './comando/model/comando.entity';
import * as bcryptjs from 'bcryptjs';
import { TipoPregunta } from './tipo-pregunta/model/tipo-pregunta.entity';

@Injectable()
export class SeedDbService implements OnModuleInit {
  constructor(
    private readonly departamentoService: DepartamentoService,
    private readonly gradoService: GradoService,
    private readonly poblacionService: PoblacionService,
    private readonly motivoService: MotivoService,
    private readonly comandoService: ComandoService,

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
    @InjectRepository(TipoPregunta)
    private readonly tipoPreguntaRepository: Repository<TipoPregunta>,
  ) {}

  async onModuleInit() {
    await this.runSeed();
  }

  async runSeed() {
    try {
      await this.insertDepartamentos();
      await this.insertGrados();
      await this.insertPoblacion();
      await this.insertMotivo();
      await this.insertComando();
      await this.insertAdmin();
      await this.insertTipoPregunta();
      console.log('✅ Seeding completado correctamente.');
    } catch (error) {
      console.error('❌ Error durante el seeding:', error);
    }
  }

  private async insertDepartamentos() {
    const departamentos = initialData.departamentos;
    const existentes = await this.departamentoService.findAll();
    const existentesNombres = existentes.map(dep => dep.nombre_departamento);
    const nuevos = departamentos.filter(dep => !existentesNombres.includes(dep.nombre_departamento));

    if (nuevos.length) {
      await Promise.all(nuevos.map(d => this.departamentoService.createDepartamento(d)));
      console.log('Departamentos insertados.');
    } else {
      console.log('Departamentos ya existen.');
    }
  }

  private async insertGrados() {
    const grados = initialData.grado;
    const existentes = await this.gradoService.findAll();
    const existentesNombres = existentes.map(g => g.nombre_grado);
    const nuevos = grados.filter(g => !existentesNombres.includes(g.nombre_grado));

    if (nuevos.length) {
      await Promise.all(nuevos.map(g => this.gradoService.createGrado(g)));
      console.log('Grados insertados.');
    } else {
      console.log('Grados ya existen.');
    }
  }

  private async insertPoblacion() {
    const poblacion = initialData.poblacion;
    const existentes = await this.poblacionService.findAll();
    const existentesNombres = existentes.map(p => p.nombre_poblacion);
    const nuevos = poblacion.filter(p => !existentesNombres.includes(p.nombre_poblacion));

    if (nuevos.length) {
      await Promise.all(nuevos.map(p => this.poblacionService.createPoblacion(p)));
      console.log('Poblaciones insertadas.');
    } else {
      console.log('Poblaciones ya existen.');
    }
  }

  private async insertMotivo() {
    const motivos = initialData.motivo;
    const existentes = await this.motivoService.findAll();
    const existentesNombres = existentes.map(m => m.nombre_motivo);
    const nuevos = motivos.filter(m => !existentesNombres.includes(m.nombre_motivo));

    if (nuevos.length) {
      await Promise.all(nuevos.map(m => this.motivoService.createMotivo(m)));
      console.log('Motivos insertados.');
    } else {
      console.log('Motivos ya existen.');
    }
  }

  private async insertComando() {
    const comandos = initialData.comando;
    const existentes = await this.comandoService.findAll();
    const existentesNombres = existentes.map(c => c.nombre_comando);
    const nuevos = comandos.filter(c => !existentesNombres.includes(c.nombre_comando));

    if (nuevos.length) {
      await Promise.all(nuevos.map(c => this.comandoService.createComando(c)));
      console.log('Comandos insertados.');
    } else {
      console.log('Comandos ya existen.');
    }
  }

  private async insertTipoPregunta() {
    const tipos = initialData.tipo_pregunta;
    const existentes = await this.tipoPreguntaRepository.find();

    if (existentes.length > 0) {
      console.log('Tipos de pregunta ya existen.');
      return;
    }

    const insertados = tipos.map(tp => {
      const tipo = new TipoPregunta();
      tipo.codigo_tipoP = tp.codigo_tipo_pregunta;
      tipo.estado = tp.estado;
      tipo.descripcion = tp.descripcion;
      return tipo;
    });

    await this.tipoPreguntaRepository.save(insertados);
    console.log('Tipos de pregunta insertados.');
  }

  private async insertAdmin() {
    const usuarios = initialData.usuario;
    const existentes = await this.usuarioRepository.find();

    if (existentes.length > 0) {
      console.log('Usuario administrador ya existe.');
      return;
    }

    const nuevos: Usuario[] = [];

    for (const user of usuarios) {
      const u = new Usuario();
      u.dpi = user.dpi;
      u.estado = user.estado;
      u.nombre_completo = user.nombre_completo;
      u.telefono = user.telefono;
      u.rol = user.rol;
      u.nombre_usuario = user.nombre_usuario;
      u.password = bcryptjs.hashSync(user.contrasenia, 10);

      u.grado = await this.gradoRepository.findOne({ where: { codigo_grado: user.grado } });
      u.poblacion = await this.poblacionRepository.findOne({ where: { codigo_poblacion: user.poblacion } });
      u.residencia = await this.departamentoRepository.findOne({ where: { codigo_departamento: user.residencia } });
      u.comando = await this.comandoRepository.findOne({ where: { codigo_comando: user.comando } });

      nuevos.push(u);
    }

    await this.usuarioRepository.save(nuevos);
    console.log('Usuario administrador insertado.');
  }
}
