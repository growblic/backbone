import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { AdminSessionPrismaRepository } from '@modules/backoffice/admin-auth/infrastructure/repositories/admin-session.prisma.repository';

@Injectable()
export class AdminLogoutUseCase {
  constructor(
    private readonly jwtService: JwtService,

    private readonly adminSessionRepository: AdminSessionPrismaRepository,
  ) {}

  async execute(
    refreshToken: string,
  ) {
    try {
      await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret:
            process.env.JWT_REFRESH_SECRET,
        },
      );

      await this.adminSessionRepository.revokeSession(
        refreshToken,
      );

      return {
        success: true,
      };
    } catch {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }
  }
}