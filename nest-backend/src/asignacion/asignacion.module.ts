import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionController } from './asignacion.controller';
import { AsignacionService } from './asignacion.service';
import { Asignacion } from './model/asignacion.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { Examen } from 'src/examen/model/examen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asignacion, Usuario, Examen]), // Importa las entidades necesarias
  ],
  controllers: [AsignacionController], // Declara el controlador
  providers: [AsignacionService], // Declara el servicio
})
export class AsignacionModule {}
