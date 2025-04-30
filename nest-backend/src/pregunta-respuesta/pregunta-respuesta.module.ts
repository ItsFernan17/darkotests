import { Module } from '@nestjs/common';
import { PreguntaRespuestaService } from './pregunta-respuesta.service';
import { PreguntaRespuestaController } from './pregunta-respuesta.controller';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntaRespuesta } from './model/pregunta-respuesta.entity';
import { Pregunta } from 'src/pregunta/model/pregunta.entity';
import { Respuesta } from 'src/respuesta/model/respuesta.entity';
import { PreguntaModule } from 'src/pregunta/pregunta.module';
import { RespuestaService } from 'src/respuesta/respuesta.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([PreguntaRespuesta, Usuario, Pregunta, Respuesta]),
    UsuarioModule,
    PreguntaModule,
  ],
  controllers: [PreguntaRespuestaController],
  providers: [PreguntaRespuestaService, RespuestaService],
  exports: [PreguntaRespuestaService, TypeOrmModule],
})
export class PreguntaRespuestaModule {}
