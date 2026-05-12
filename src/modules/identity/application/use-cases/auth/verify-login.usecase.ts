import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from '@modules/identity/domain/repositories/user.repository';

import { OtpService } from '@modules/identity/application/services/otp.service';

import { TokenService } from '@modules/identity/application/services/token.service';

import { SessionService } from '@modules/identity/application/services/session.service';

import { CreateUserUseCase } from '@modules/identity/application/use-cases/register/create-user.usecase';

@Injectable()
export class VerifyLoginUseCase {
  constructor(
    private readonly otpService: OtpService,

    @Inject('UserRepository')
    private readonly userRepo: UserRepository,

    private readonly tokenService: TokenService,

    private readonly sessionService: SessionService,

    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(
    phone: string,
    otp: string,

    metadata?: {
      ipAddress?: string;
      userAgent?: string;
      deviceName?: string;
    },
  ) {
    // 🔥 verify otp
    const isValid =
      await this.otpService.verifyOtp(
        phone,
        otp,
      );

    if (!isValid) {
      throw new UnauthorizedException(
        'Invalid or expired OTP',
      );
    }

    // 🔥 remove otp
    await this.otpService.deleteOtp(
      phone,
    );

    // 🔥 get user
    let user =
      await this.userRepo.findByPhone(
        phone,
      );

    // 🔥 auto create user if not exists
    if (!user) {
      user =
        await this.createUserUseCase.execute(
          phone,
          'IN',
          'login',
        );
    }

    // 🔥 generate fingerprint
    const fingerprint =
      `${metadata?.ipAddress}-${metadata?.userAgent}-${metadata?.deviceName}`;

    // 🔥 temporary refresh token
    const temporaryRefreshToken =
      this.tokenService.generateRefreshToken({
        userId: user.id,
        sessionId: 'temp',
      });

    // 🔥 create redis session
    const session =
      await this.sessionService.createSession(
        user.id,

        temporaryRefreshToken,

        {
          ipAddress:
            metadata?.ipAddress,

          userAgent:
            metadata?.userAgent,

          deviceName:
            metadata?.deviceName,

          fingerprint,
        },
      );

    // 🔥 generate final access token
    const accessToken =
      this.tokenService.generateAccessToken({
        sub: user.id,
        role: user.role,
      });

    // 🔥 generate final refresh token
    const refreshToken =
      this.tokenService.generateRefreshToken({
        userId: user.id,
        sessionId: session.id,
      });

    // 🔥 rotate refresh token
    await this.sessionService.rotateRefreshToken(
      session.id,
      refreshToken,
    );

    return {
      accessToken,

      refreshToken,

      session: {
        sessionId: session.id,

        deviceName:
          session.deviceName,

        ipAddress:
          session.ipAddress,

        fingerprint:
          session.fingerprint,

        createdAt:
          session.createdAt,
      },

      user: {
        id: user.id,

        phone: user.phone,
      },
    };
  }
}