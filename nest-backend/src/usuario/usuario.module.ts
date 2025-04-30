import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './model/usuario.entity';
import { DepartamentoModule } from 'src/seed-db/departamento/departamento.module';
import { SeedDbModule } from 'src/seed-db/seed-db.module';
import { PoblacionModule } from 'src/seed-db/poblacion/poblacion.module';
import { ComandoModule } from 'src/seed-db/comando/comando.module';
import { GradoModule } from 'src/seed-db/grado/grado.module';
import { Departamento } from 'src/seed-db/departamento/model/departamento.entity';
import { Comando } from 'src/seed-db/comando/model/comando.entity';
import { Poblacion } from 'src/seed-db/poblacion/model/poblacion.entity';
import { Grado } from 'src/seed-db/grado/model/grado.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([Usuario, Departamento, Comando, Poblacion, Grado]),
    SeedDbModule,
    DepartamentoModule,
    PoblacionModule,
    ComandoModule,
    GradoModule,
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService, TypeOrmModule],
})
export class UsuarioModule {}
