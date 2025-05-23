import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // ✅ Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Carpeta de uploads (si la usas)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ Carpeta de fotos con CORS habilitado
  app.use(
    '/resources/pictures',
    cors({ origin: '*' }), // 🔓 Puedes restringir a ['http://localhost:4321'] en producción
    express.static(join(__dirname, '..', 'resources', 'pictures')),
  );

  // ✅ Habilita CORS general
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
