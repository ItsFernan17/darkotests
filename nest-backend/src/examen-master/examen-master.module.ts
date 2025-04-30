import { forwardRef, Module } from '@nestjs/common';
import { ExamenMasterService } from './examen-master.service';
import { ExamenMasterController } from './examen-master.controller';
import { Usuario } from 'src/usuario/model/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamenMaster } from './model/examen-master.entity';
import { Pregunta } from 'src/pregunta/model/pregunta.entity';
import { PreguntaModule } from 'src/pregunta/pregunta.module';
import { SerieExamen } from 'src/serie-examen/model/serie-examen.entity';
import { SerieExamenModule } from 'src/serie-examen/serie-examen.module';
import { TipoExamen } from 'src/tipo-examen/model/tipo-examen.entity';
import { SerieModule } from 'src/serie/serie.module';
import { TipoExamenModule } from 'src/tipo-examen/tipo-examen.module';
import { ExamenModule } from 'src/examen/examen.module';
import { Examen } from 'src/examen/model/examen.entity';
import { PreguntaRespuesta } from 'src/pregunta-respuesta/model/pregunta-respuesta.entity';
import { Motivo } from 'src/seed-db/motivo/model/motivo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamenMaster, Pregunta, Usuario, SerieExamen, TipoExamen, Examen, PreguntaRespuesta, Motivo]),
    UsuarioModule,
    PreguntaModule,
    SerieModule,
    SerieExamenModule,
    forwardRef(() => TipoExamenModule), // Use forwardRef to resolve potential circular dependency
    forwardRef(() => ExamenModule), // Use forwardRef to resolve potential circular dependency
  ],
  controllers: [ExamenMasterController],
  providers: [ExamenMasterService],
  exports: [ExamenMasterService, TypeOrmModule],
})
export class ExamenMasterModule {}
