import { Module } from '@nestjs/common';
import { GradoController } from './grado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grado } from './model/grado.entity'
import { GradoService } from './grado.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grado])],
  controllers: [GradoController],
  providers: [GradoService],
  exports: [GradoService, TypeOrmModule]
})
export class GradoModule {}
