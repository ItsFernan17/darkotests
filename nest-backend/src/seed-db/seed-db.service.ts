import { Injectable } from '@nestjs/common';
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
export class SeedDbService {
  constructor(
    private readonly departamentoService: DepartamentoService,
    private readonly gradoService: GradoService,
    private readonly poblacionService: PoblacionService,
    private readonly motivoService: MotivoService,
    private readonly comandoService: ComandoService,


    @InjectRepository( Usuario )
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository( Departamento )
    private readonly departamentoRepository: Repository<Departamento>,
    @InjectRepository( Grado )
    private readonly gradoRepository: Repository<Grado>,
    @InjectRepository( Poblacion )
    private readonly poblacionRepository: Repository<Poblacion>,
    @InjectRepository( Comando )
    private readonly comandoRepository: Repository<Comando>,
    @InjectRepository( TipoPregunta )
    private readonly tipoPreguntaRepository: Repository<TipoPregunta>,
  ) {}

  async runSeed() {
    try {
      await this.insertDepartamentos();
      await this.insertGrados();
      await this.insertPoblacion();
      await this.insertMotivo();
      await this.insertComando();
      await this.insertAdmin();
      await this.insertTipoPregunta();
      return { message: 'Datos insertados correctamente' };
    } catch (error) {
      console.error('Error during seeding:', error);
      return { message: 'Error durante la inserción de datos' };
    }
  }

  private async insertDepartamentos() {
    const departamentos = initialData.departamentos;

    const existingDepartamentos = await this.departamentoService.findAll();
    const existingDepartamentoNames = existingDepartamentos.map(dep => dep.nombre_departamento);

    const departamentosToInsert = departamentos.filter(dep => !existingDepartamentoNames.includes(dep.nombre_departamento));

    if (departamentosToInsert.length === 0) {
      console.log('Departamentos ya existen. No se insertarán nuevos datos.');
    } else {
      const insertPromises = departamentosToInsert.map(departamento =>
        this.departamentoService.createDepartamento(departamento) 
      );
      await Promise.all(insertPromises);
      console.log('Nuevos departamentos insertados.');
    }
  }

  private async insertGrados() {
    const grados = initialData.grado;

    const existingGrados = await this.gradoService.findAll();
    const existingGradoNames = existingGrados.map(grado => grado.nombre_grado);

    const gradosToInsert = grados.filter(grado => !existingGradoNames.includes(grado.nombre_grado));

    if (gradosToInsert.length === 0) {
      console.log('Grados ya existen. No se insertarán nuevos datos.');
    } else {
      const insertPromises = gradosToInsert.map(grado =>
        this.gradoService.createGrado(grado)
      );
      await Promise.all(insertPromises);
      console.log('Nuevos grados insertados.');
    }
  }

  private async insertPoblacion(){
    const poblacion = initialData.poblacion;

    const existingPoblacion = await this.poblacionService.findAll();
    const existingPoblacionNames = existingPoblacion.map(poblacion => poblacion.nombre_poblacion);

    const poblacionToInsert = poblacion.filter(poblacion => !existingPoblacionNames.includes(poblacion.nombre_poblacion));

    if(poblacionToInsert.length === 0){
      console.log('Poblaciones ya existe. No se insertarán nuevos datos.');
    } else {
      const insertPromises = poblacionToInsert.map(poblacion =>
        this.poblacionService.createPoblacion(poblacion)
      );
      await Promise.all(insertPromises);
      console.log('Nuevas poblaciones insertadas.');
    }
  }

  private async insertMotivo(){
    const motivo = initialData.motivo;

    const existingMotivo = await this.motivoService.findAll();
    const existingMotivoNames = existingMotivo.map(motivo => motivo.nombre_motivo);

    const motivoToInsert = motivo.filter(motivo => !existingMotivoNames.includes(motivo.nombre_motivo));

    if(motivoToInsert.length === 0){
      console.log('Motivos ya existen. No se insertarán nuevos datos.');
    } else {
      const insertPromises = motivoToInsert.map(motivo =>
        this.motivoService.createMotivo(motivo)
      );
      await Promise.all(insertPromises);
      console.log('Nuevos motivos insertados.');
    }
  }

  private async insertComando(){
    const comando = initialData.comando;

    const existingComando = await this.comandoService.findAll();
    const existingComandoNames = existingComando.map(comando => comando.nombre_comando);

    const comandoToInsert = comando.filter(comando => !existingComandoNames.includes(comando.nombre_comando));

    if(comandoToInsert.length === 0){
      console.log('Comandos ya existen. No se insertarán nuevos datos.');
    } else {
      const insertPromises = comandoToInsert.map(comando =>
        this.comandoService.createComando(comando)
      );
      await Promise.all(insertPromises);
      console.log('Nuevos comandos insertados.');
    }
  }

  private async insertTipoPregunta(){
    const seedTipoPregunta = initialData.tipo_pregunta;

    const existingTipoPregunta = await this.tipoPreguntaRepository.find();
    if (existingTipoPregunta.length > 0) {
      console.log('Tipos de pregunta ya existen. No se insertarán nuevos datos.');
      return;
    }
  
    const tipoPregunta: TipoPregunta[] = [];
  
    for (const tipo of seedTipoPregunta) {
      const newTipo = new TipoPregunta();
      newTipo.codigo_tipoP = tipo.codigo_tipo_pregunta;
      newTipo.estado = tipo.estado;
      newTipo.descripcion = tipo.descripcion;
      tipoPregunta.push(newTipo);
    }
  
    const dbTipoPregunta = await this.tipoPreguntaRepository.save(tipoPregunta);
    console.log('Tipos de Preguntas Insertadas.');
    return dbTipoPregunta;
    
  }

  private async insertAdmin(){
      const seedUsers = initialData.usuario;

      const existingUsers = await this.usuarioRepository.find();
      if (existingUsers.length > 0) {
        console.log('Usuario Administrador ya existe. No se insertarán nuevos datos.');
        return;
      }
  
      const usuario: Usuario[] = [];
  
      for (const user of seedUsers) {
        const newUser = new Usuario();
        newUser.dpi = user.dpi;
        newUser.estado = user.estado;
        newUser.nombre_completo = user.nombre_completo;
        newUser.telefono = user.telefono; 
        newUser.rol = user.rol;
        newUser.nombre_usuario = user.nombre_usuario;
        newUser.password = bcryptjs.hashSync(user.contrasenia, 10);
  
        const grado = await this.gradoRepository.findOne({ where: { codigo_grado: user.grado } });
        const poblacion = await this.poblacionRepository.findOne({ where: { codigo_poblacion: user.poblacion } });
        const residencia = await this.departamentoRepository.findOne({ where: { codigo_departamento: user.residencia } });
        const comando = await this.comandoRepository.findOne({ where: { codigo_comando: user.comando } });

        newUser.grado = grado;
        newUser.poblacion = poblacion;
        newUser.residencia = residencia;
        newUser.comando = comando;
        usuario.push(newUser);
      }
  
      const dbUsers = await this.usuarioRepository.save(usuario);
      console.log('Usuario Administrador Insertado.');
  
      return dbUsers[0];
    }
}
