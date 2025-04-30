import { Module } from '@nestjs/common';
import { ComandoService } from './comando.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comando } from './model/comando.entity';
import { ComandoController } from './comando.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comando])],
  providers: [ComandoService],
  controllers: [ComandoController],
  exports: [TypeOrmModule, ComandoService]
})
export class ComandoModule {}
