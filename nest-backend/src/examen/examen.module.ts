import { Module } from '@nestjs/common';
import { ExamenService } from './examen.service';
import { ExamenController } from './examen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { TipoExamen } from 'src/tipo-examen/model/tipo-examen.entity';
import { Examen } from './model/examen.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TipoExamenModule } from 'src/tipo-examen/tipo-examen.module';
import { Motivo } from 'src/seed-db/motivo/model/motivo.entity';
import { MotivoModule } from 'src/seed-db/motivo/motivo.module';



@Module({
  imports: [TypeOrmModule.forFeature([Examen, Usuario, TipoExamen, Motivo]), UsuarioModule, TipoExamenModule, MotivoModule],
  controllers: [ExamenController],
  providers: [ExamenService],
  exports: [ExamenService, TypeOrmModule],
})
export class ExamenModule {}
