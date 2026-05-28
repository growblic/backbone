import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware
  implements NestMiddleware
{
  use(
    req: any,
    res: any,
    next: () => void,
  ) {
    const requestId =
      randomUUID();

    req.requestId = requestId;

    // ✅ FASTIFY
    if (res.header) {
      res.header(
        'x-request-id',
        requestId,
      );
    }

    next();
  }
}