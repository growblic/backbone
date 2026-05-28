import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,

    next: CallHandler,
  ): Observable<any> {
    const request =
      context
        .switchToHttp()
        .getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,

        statusCode: 200,

        path: request.url,

        method: request.method,

        timestamp:
          new Date().toISOString(),

        data,
      })),
    );
  }
}