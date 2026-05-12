import 'dotenv/config';

import {
  ValidationPipe,
} from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  console.log(
    'DATABASE_URL =>',
    process.env.DATABASE_URL,
  );

  const app =
    await NestFactory.create(
      AppModule,
    );

  // ✅ GLOBAL VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,
    }),
  );

  await app.listen(
    process.env.PORT ?? 3000,
  );

  console.log(
    `🚀 SERVER RUNNING ON PORT ${process.env.PORT ?? 3000}`,
  );
}

bootstrap();