import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response =
      ctx.getResponse();

    const request =
      ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      success: false,

      statusCode: status,

      path: request.url,

      method: request.method,

      timestamp:
        new Date().toISOString(),

      message:
        typeof exceptionResponse ===
        'string'
          ? exceptionResponse
          : (
              exceptionResponse as any
            ).message,

      errors: exceptionResponse,
    };

    // ✅ Fastify
    if (
      typeof response.code ===
      'function'
    ) {
      return response
        .code(status)
        .send(errorResponse);
    }

    // ✅ Express fallback
    if (
      typeof response.status ===
      'function'
    ) {
      return response
        .status(status)
        .json(errorResponse);
    }

    // ✅ ultimate fallback
    return errorResponse;
  }
}