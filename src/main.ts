import 'dotenv/config';

import {
  ValidationPipe,
} from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

import { ValidationExceptionFilter }
from '@common/filters/validation-exception.filter';

import { HttpExceptionFilter }
from '@common/filters/http-exception.filter';

import { PrismaExceptionFilter }
from '@common/filters/prisma-exception.filter';

import { ResponseInterceptor }
from '@common/interceptors/response.interceptor';

async function bootstrap() {
  const app =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

  // =====================================================
  // ✅ GLOBAL PREFIX
  // =====================================================

  app.setGlobalPrefix('api/v1');

  // =====================================================
  // ✅ CORS
  // =====================================================

  app.enableCors();

  // =====================================================
  // ✅ VALIDATION
  // =====================================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      transform: true,

      forbidNonWhitelisted: true,
    }),
  );

  // =====================================================
  // ✅ SWAGGER CONFIG
  // =====================================================

  const config =
    new DocumentBuilder()
      .setTitle('Growblic API')

      .setDescription(
        'Growblic Enterprise Backend APIs',
      )

      .setVersion('1.0')

      .addBearerAuth(
        {
          type: 'http',

          scheme: 'bearer',

          bearerFormat: 'JWT',

          name: 'Authorization',

          description:
            'Enter JWT access token',

          in: 'header',
        },

        'access-token',
      )

      .build();

  // =====================================================
  // ✅ SWAGGER DOCUMENT
  // =====================================================

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  // =====================================================
  // ✅ SWAGGER SETUP
  // =====================================================

  SwaggerModule.setup(
    'docs',
    app,
    document,
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );

  // =====================================================
  // ✅ EXCEPTION FILTERS
  // =====================================================

  app.useGlobalFilters(
    new ValidationExceptionFilter(),

    new HttpExceptionFilter(),

    new PrismaExceptionFilter(),
  );

  // =====================================================
  // ✅ RESPONSE INTERCEPTOR
  // =====================================================

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
  );

  // =====================================================
  // ✅ START SERVER
  // =====================================================

  await app.listen({
    port: 3000,

    host: '0.0.0.0',
  });

  console.log(
    '🚀 SERVER RUNNING',
  );

  console.log(
    '📘 Swagger Docs: http://localhost:3000/docs',
  );
}

bootstrap();