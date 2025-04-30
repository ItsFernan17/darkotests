import { Module } from '@nestjs/common';
import { PoblacionService } from './poblacion.service';
import { Poblacion } from './model/poblacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoblacionController } from './poblacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poblacion])],
  controllers: [PoblacionController],
  providers: [PoblacionService],
  exports: [PoblacionService, TypeOrmModule]
})
export class PoblacionModule {}
