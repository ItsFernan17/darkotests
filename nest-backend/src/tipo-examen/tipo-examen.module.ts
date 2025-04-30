import { forwardRef, Module } from '@nestjs/common';
import { TipoExamenService } from './tipo-examen.service';
import { TipoExamenController } from './tipo-examen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TipoExamen } from './model/tipo-examen.entity';
import { Empleo } from 'src/empleo/model/empleo.entity';
import { EmpleoModule } from 'src/empleo/empleo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoExamen, Empleo, Usuario]),
    UsuarioModule,
    EmpleoModule
  ],
  controllers: [TipoExamenController],
  providers: [TipoExamenService],
  exports: [TipoExamenService, TypeOrmModule],
})
export class TipoExamenModule {}
