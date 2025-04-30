import { Module } from '@nestjs/common';
import { Motivo } from './model/motivo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotivoController } from './motivo.controller';
import { MotivoService } from './motivo.service';

@Module({
    imports: [TypeOrmModule.forFeature([Motivo])],
    controllers: [MotivoController],
    providers: [MotivoService],
    exports: [TypeOrmModule]
})
export class MotivoModule {}
