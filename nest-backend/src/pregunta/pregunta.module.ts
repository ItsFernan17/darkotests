import { Module } from '@nestjs/common';
import { PreguntaService } from './pregunta.service';
import { PreguntaController } from './pregunta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pregunta } from './model/pregunta.entity';
import { TipoPregunta } from 'src/seed-db/tipo-pregunta/model/tipo-pregunta.entity';
import { Usuario } from 'src/usuario/model/usuario.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Pregunta, TipoPregunta, Usuario])],
  controllers: [PreguntaController],
  providers: [PreguntaService],
  exports: [PreguntaService, TypeOrmModule],
})
export class PreguntaModule {}
