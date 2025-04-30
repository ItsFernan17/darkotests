import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Empleo } from './model/empleo.entity';
import { EmpleoController } from './empleo.controller'; 
import { EmpleoService } from './empleo.service'; 
import { Usuario } from 'src/usuario/model/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Empleo]), Usuario, UsuarioModule],
  controllers: [EmpleoController],
  providers: [EmpleoService,],
  exports: [EmpleoService, TypeOrmModule],
})
export class EmpleoModule {}
