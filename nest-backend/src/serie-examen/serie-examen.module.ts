import { Module } from '@nestjs/common';
import { SerieExamenService } from './serie-examen.service';
import { SerieExamenController } from './serie-examen.controller';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerieExamen } from './model/serie-examen.entity';
import { Examen } from 'src/examen/model/examen.entity';
import { Serie } from 'src/serie/model/serie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SerieExamen, Usuario, Examen, Serie]), UsuarioModule],
  controllers: [SerieExamenController],
  providers: [SerieExamenService],
  exports: [SerieExamenService, TypeOrmModule],
})
export class SerieExamenModule {}
