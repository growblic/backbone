import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import {
  FastifyReply,
  FastifyRequest,
} from 'fastify';

@Catch(
  Prisma.PrismaClientKnownRequestError,
)
export class PrismaExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception:
      Prisma.PrismaClientKnownRequestError,

    host: ArgumentsHost,
  ) {
    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse<FastifyReply>();

    const request =
      ctx.getRequest<FastifyRequest>();

    // =====================================================
    // ✅ DEFAULT VALUES
    // =====================================================

    let statusCode =
      HttpStatus.BAD_REQUEST;

    let message =
      'Database operation failed';

    // =====================================================
    // ✅ PRISMA ERROR HANDLING
    // =====================================================

    switch (exception.code) {
      // ===================================================
      // UNIQUE CONSTRAINT
      // ===================================================

      case 'P2002':
        statusCode =
          HttpStatus.CONFLICT;

        message =
          'Record already exists';

        break;

      // ===================================================
      // RECORD NOT FOUND
      // ===================================================

      case 'P2025':
        statusCode =
          HttpStatus.NOT_FOUND;

        message =
          'Record not found';

        break;

      // ===================================================
      // FOREIGN KEY FAILED
      // ===================================================

      case 'P2003':
        statusCode =
          HttpStatus.BAD_REQUEST;

        message =
          'Invalid reference provided';

        break;

      // ===================================================
      // DEFAULT
      // ===================================================

      default:
        statusCode =
          HttpStatus.INTERNAL_SERVER_ERROR;


          console.error(exception);
          console.error(exception.meta);
           message = 
           'internal database error';
    }

    // =====================================================
    // ✅ RESPONSE
    // =====================================================

    response.status(statusCode).send({
      success: false,

      statusCode,

      path: request.url,

      method: request.method,

      timestamp:
        new Date().toISOString(),

      prismaCode:
        exception.code,

      message,
    });
  }
}