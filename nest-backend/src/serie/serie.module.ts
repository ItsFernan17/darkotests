import { Module } from '@nestjs/common';
import { SerieService } from './serie.service';
import { SerieController } from './serie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { Serie } from './model/serie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Serie]), Usuario, UsuarioModule],
  controllers: [SerieController],
  providers: [SerieService],
  exports: [SerieService, TypeOrmModule],
})
export class SerieModule {}
