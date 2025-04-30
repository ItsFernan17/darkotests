import { Module } from '@nestjs/common';
import { RespuestaService } from './respuesta.service';
import { RespuestaController } from './respuesta.controller';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respuesta } from './model/respuesta.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Respuesta]), Usuario, UsuarioModule],
  controllers: [RespuestaController],
  providers: [RespuestaService],
  exports: [RespuestaService, TypeOrmModule],
})
export class RespuestaModule {}
