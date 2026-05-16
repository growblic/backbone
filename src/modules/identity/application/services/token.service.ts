import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  // =====================================================
  // ✅ ACCESS TOKEN
  // =====================================================

  generateAccessToken(payload: {
    sub: string;

    role: string;

    sessionId: string;
  }): string {
    return this.jwtService.sign(payload, {
      secret:
        process.env.JWT_ACCESS_SECRET as string,

      expiresIn:
        (process.env.JWT_ACCESS_EXPIRES_IN ??
          '15m') as any,

      issuer: 'growblic-api',

      audience: 'growblic-users',
    });
  }

  // =====================================================
  // ✅ REFRESH TOKEN
  // =====================================================

  generateRefreshToken(payload: {
    sub: string;

    sessionId: string;
  }): string {
    return this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET as string,

      expiresIn:
        (process.env.JWT_REFRESH_EXPIRES_IN ??
          '30d') as any,

      issuer: 'growblic-api',

      audience: 'growblic-users',
    });
  }

  // =====================================================
  // ✅ VERIFY ACCESS TOKEN
  // =====================================================

  verifyAccessToken(
    token: string,
  ) {
    return this.jwtService.verify(token, {
      secret:
        process.env.JWT_ACCESS_SECRET as string,

      issuer: 'growblic-api',

      audience: 'growblic-users',
    });
  }

  // =====================================================
  // ✅ VERIFY REFRESH TOKEN
  // =====================================================

  verifyRefreshToken(
    token: string,
  ) {
    return this.jwtService.verify(token, {
      secret:
        process.env.JWT_REFRESH_SECRET as string,

      issuer: 'growblic-api',

      audience: 'growblic-users',
    });
  }
}