import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  'jwt',
) {
  constructor(
    private readonly reflector:
      Reflector,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ) {
    // ==========================================
    // ✅ CHECK PUBLIC ROUTE
    // ==========================================

    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,

        [
          context.getHandler(),

          context.getClass(),
        ],
      );

    if (isPublic) {
      return true;
    }
 
    return super.canActivate(
      context,
    );
  }

  handleRequest(
    err: any,

    user: any,
  ) {
    // ==========================================
    // ✅ INVALID TOKEN
    // ==========================================

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Unauthorized access',
        )
      );
    }

    return user;
  }
}