import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { AdminSessionPrismaRepository } from '@modules/backoffice/admin-auth/infrastructure/repositories/admin-session.prisma.repository';

@Injectable()
export class AdminRefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,

    private readonly adminSessionRepository: AdminSessionPrismaRepository,
  ) {}

  async execute(
    refreshToken: string,
  ) {
    let payload: {
      sub: string;
      email: string;
      role: string;
      type: string;
    };

    try {
      payload =
        await this.jwtService.verifyAsync(
          refreshToken,
          {
            secret:
              process.env.JWT_REFRESH_SECRET as string,
          },
        );
    } catch {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    if (
      payload.type !== 'refresh'
    ) {
      throw new UnauthorizedException(
        'Invalid token type',
      );
    }

    const session =
      await this.adminSessionRepository.findByRefreshToken(
        refreshToken,
      );

    if (!session) {
      throw new UnauthorizedException(
        'Session not found',
      );
    }

    if (session.isRevoked) {
      throw new UnauthorizedException(
        'Session revoked',
      );
    }

    if (
      new Date(session.expiresAt) <
      new Date()
    ) {
      throw new UnauthorizedException(
        'Session expired',
      );
    }

    const accessToken =
      await this.jwtService.signAsync(
        {
          sub: payload.sub,

          email: payload.email,

          role: payload.role,

          type: 'access',
        },

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

    return {
      accessToken,
    };
  }
}