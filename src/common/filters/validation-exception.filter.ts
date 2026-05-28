import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';

import {
  FastifyReply,
  FastifyRequest,
} from 'fastify';

@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: BadRequestException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();

    const response =
      ctx.getResponse<FastifyReply>();

    const request =
      ctx.getRequest<FastifyRequest>();

    const exceptionResponse =
      exception.getResponse() as any;

    response.status(400).send({
      success: false,
      statusCode: 400,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: 'Validation failed',
      errors:
        exceptionResponse.message || [],
    });
  }
}