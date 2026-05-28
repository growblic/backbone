import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminJwtService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(
    adminId: string,
    email: string,
    role: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: adminId,
        email,
        role,
        type: 'access',
      } as Record<string, unknown>,
      {
        secret:
          process.env.JWT_ACCESS_SECRET as string,

        expiresIn:
          process.env.JWT_ACCESS_EXPIRES_IN as
            | '15m'
            | '30m'
            | '1h'
            | '1d',
      },
    );
  }

async generateRefreshToken(
  adminId: string,
  email: string,
  role: string,
) {
  return this.jwtService.signAsync(
    {
      sub: adminId,
      email,
      role,
      type: 'refresh',
    },
    {
      secret:
        process.env.JWT_REFRESH_SECRET as string,

      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN as
          | '15m'
          | '30m'
          | '1h'
          | '1d'
          | '7d'
          | '14d'
          | '30d',
    },
  );
}
}
