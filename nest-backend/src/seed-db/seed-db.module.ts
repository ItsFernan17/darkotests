import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedDbService } from './seed-db.service';
import { SeedDbController } from './seed-db.controller';
import { DepartamentoService } from './departamento/departamento.service';
import { GradoService } from './grado/grado.service';
import { PoblacionService } from './poblacion/poblacion.service';
import { MotivoService } from './motivo/motivo.service';
import { TipoPreguntaService } from './tipo-pregunta/tipo-pregunta.service';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { ComandoModule } from './comando/comando.module';
import { Comando } from './comando/model/comando.entity';
import { DepartamentoModule } from './departamento/departamento.module';
import { Departamento } from './departamento/model/departamento.entity';
import { GradoModule } from './grado/grado.module';
import { Grado } from './grado/model/grado.entity';
import { MotivoModule } from './motivo/motivo.module';
import { Poblacion } from './poblacion/model/poblacion.entity';
import { PoblacionModule } from './poblacion/poblacion.module';
import { TipoPregunta } from './tipo-pregunta/model/tipo-pregunta.entity';
import { TipoPreguntaModule } from './tipo-pregunta/tipo-pregunta.module';

@Module({
  controllers: [SeedDbController],
  imports: [
    TypeOrmModule.forFeature([Usuario, Departamento, Grado, Poblacion, Comando, TipoPregunta]), 
    DepartamentoModule,
    GradoModule,
    PoblacionModule,
    ComandoModule,
    MotivoModule,
    TipoPreguntaModule,
  ],
  providers: [SeedDbService, DepartamentoService, GradoService, PoblacionService, MotivoService],
})
export class SeedDbModule {}