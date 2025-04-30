import { Module } from '@nestjs/common';
import { TipoPreguntaService } from './tipo-pregunta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPregunta } from './model/tipo-pregunta.entity';
import { TipoPreguntaController } from './tipo-pregunta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPregunta])],
  providers: [TipoPreguntaService],
  controllers: [TipoPreguntaController],
  exports: [TipoPreguntaService, TypeOrmModule],
})
export class TipoPreguntaModule {}
