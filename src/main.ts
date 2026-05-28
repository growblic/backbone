import 'dotenv/config';

import {
  ValidationPipe,
} from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';

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
  // ✅ SECURITY
  // =====================================================

  await app.register(helmet);

  // =====================================================
  // ✅ GLOBAL PREFIX
  // =====================================================

  app.setGlobalPrefix('api/v1');

  // =====================================================
  // ✅ CORS
  // =====================================================

  app.enableCors({

    origin: [

      // local
      'http://localhost:3000',
      'http://localhost:5173',

      // production frontend apps
      'https://growblic.com',
      'https://admin.growblic.com',
      'https://app.growblic.com',

    ],

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
    ],

    credentials: true,

    maxAge: 86400,
  });

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

}

bootstrap();