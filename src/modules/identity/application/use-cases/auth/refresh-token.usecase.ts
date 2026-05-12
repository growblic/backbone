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
    private readonly tokenService: TokenService,

    private readonly sessionService: SessionService,

    @Inject('UserRepository')
    private readonly userRepo: UserRepository,
  ) {}

  async execute(refreshToken: string) {
    // 🔥 verify refresh token
    const decoded =
      this.tokenService.verifyRefreshToken(
        refreshToken,
      );

    const userId =
      decoded.userId;

    const sessionId =
      decoded.sessionId;

    // 🔥 validate redis session
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

    // 🔥 get user
    const user =
      await this.userRepo.findById(
        userId,
      );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    // 🔥 generate new access token
    const newAccessToken =
      this.tokenService.generateAccessToken({
        sub: user.id,

        role: user.role,
      });

    // 🔥 generate rotated refresh token
    const newRefreshToken =
      this.tokenService.generateRefreshToken({
        userId,
        sessionId,
      });

    // 🔥 rotate refresh token in redis
    await this.sessionService.rotateRefreshToken(
      sessionId,
      newRefreshToken,
    );

    return {
      accessToken:
        newAccessToken,

      refreshToken:
        newRefreshToken,
    };
  }
}