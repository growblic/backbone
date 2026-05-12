import {
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  generateAccessToken(payload: {
    sub: string;

    role: string;
  }): string {
    return this.jwtService.sign(
      payload as Record<string, any>,
      {
        secret:
          process.env.JWT_ACCESS_SECRET as string,

        expiresIn:
          (process.env
            .JWT_ACCESS_EXPIRES_IN ??
            '15m') as any,
      },
    );
  }

  generateRefreshToken(
    payload: Record<string, any>,
  ): string {
    return this.jwtService.sign(
      payload as Record<string, any>,
      {
        secret:
          process.env.JWT_REFRESH_SECRET as string,

        expiresIn: '30d' as any,
      },
    );
  }

  verifyAccessToken(
    token: string,
  ) {
    return this.jwtService.verify(
      token,
      {
        secret:
          process.env.JWT_ACCESS_SECRET as string,
      },
    );
  }

  verifyRefreshToken(
    token: string,
  ) {
    return this.jwtService.verify(
      token,
      {
        secret:
          process.env.JWT_REFRESH_SECRET as string,
      },
    );
  }
}