import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from '@modules/identity/application/services/token.service';

@Injectable()
export class JwtAuthGuard
  implements CanActivate
{
  constructor(
    private readonly tokenService: TokenService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request =
      context.switchToHttp().getRequest();

    const authHeader =
      request.headers['authorization'];

    // 🔥 no header
    if (!authHeader) {
      throw new UnauthorizedException(
        'Authorization header missing',
      );
    }

    const parts =
      authHeader.split(' ');

    // 🔥 invalid format
    if (
      parts.length !== 2 ||
      parts[0] !== 'Bearer'
    ) {
      throw new UnauthorizedException(
        'Invalid Authorization format',
      );
    }

    const token = parts[1];

    try {
      // 🔥 verify JWT
      const decoded =
        this.tokenService.verifyAccessToken(
          token,
        );

      // 🔥 attach user to request
      request.user = {
        sub: decoded.sub,

        role: decoded.role,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }
  }
}