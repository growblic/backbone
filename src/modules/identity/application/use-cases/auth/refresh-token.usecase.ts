import {
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';

import { TokenService } from '@modules/identity/application/services/token.service';

import { SessionService } from '@modules/identity/application/services/session.service';

import { UserRepository } from '@modules/identity/domain/repositories/user.repository';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService:
      TokenService,

    private readonly sessionService:
      SessionService,

    @Inject('UserRepository')
    private readonly userRepo:
      UserRepository,
  ) {}

  async execute(
    refreshToken: string,
  ) {
    // =====================================================
    // ✅ VERIFY REFRESH TOKEN
    // =====================================================

    const decoded =
      this.tokenService.verifyRefreshToken(
        refreshToken,
      );

    const userId =
      decoded.sub;

    const sessionId =
      decoded.sessionId;

    // =====================================================
    // ✅ VALIDATE SESSION
    // =====================================================

    const isValid =
      await this.sessionService.validateSession(
        sessionId,
        refreshToken,
      );

    if (!isValid) {
      throw new UnauthorizedException(
        'Invalid session',
      );
    }

    // =====================================================
    // ✅ GET USER
    // =====================================================

    const user =
      await this.userRepo.findById(
        userId,
      );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    // =====================================================
    // ✅ GENERATE ACCESS TOKEN
    // =====================================================

    const newAccessToken =
      this.tokenService.generateAccessToken(
        {
          sub: user.id,

          role: user.role,

          sessionId,
        },
      );

    // =====================================================
    // ✅ GENERATE ROTATED REFRESH TOKEN
    // =====================================================

    const newRefreshToken =
      this.tokenService.generateRefreshToken(
        {
          sub: user.id,

          sessionId,
        },
      );

    // =====================================================
    // ✅ ROTATE REFRESH TOKEN
    // =====================================================

    await this.sessionService.rotateRefreshToken(
      sessionId,

      newRefreshToken,
    );

    // =====================================================
    // ✅ RESPONSE
    // =====================================================

    return {
      accessToken:
        newAccessToken,

      refreshToken:
        newRefreshToken,
    };
  }
}