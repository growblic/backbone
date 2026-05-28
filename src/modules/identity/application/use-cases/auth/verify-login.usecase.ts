import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from '@modules/identity/domain/repositories/user.repository';

import { OtpService } from '@infra/sms/services/otp.service';

import { TokenService } from '@modules/identity/application/services/token.service';

import { SessionService } from '@modules/identity/application/services/session.service';

import { UserCreatorService } from '../../services/user-creator.service';

@Injectable()
export class VerifyLoginUseCase {
  constructor(
    private readonly otpService:
      OtpService,

    @Inject('UserRepository')
    private readonly userRepo:
      UserRepository,

    private readonly tokenService:
      TokenService,

    private readonly sessionService:
      SessionService,

    private readonly userCreatorService:
      UserCreatorService,
  ) {}

  async execute(
    phone: string,

    otp: string,

    source: string,

    metadata?: {
      ipAddress?: string;

      userAgent?: string;

      deviceName?: string;
    },
  ) {
    // =====================================================
    // ✅ VERIFY OTP
    // =====================================================

    await this.otpService.verifyOtp(
      phone,
      otp,
    );

    // =====================================================
    // ✅ GET USER
    // =====================================================

    let user =
      await this.userRepo.findByPhone(
        phone,
      );

    // =====================================================
    // ✅ AUTO CREATE USER
    // =====================================================

    if (!user) {
      user =
        await this.userCreatorService.createUser(
          phone,
        );
    }

    // =====================================================
    // ✅ USER SAFETY CHECK
    // =====================================================

    if (!user) {
      throw new UnauthorizedException(
        'User creation failed',
      );
    }

    // =====================================================
    // ✅ GENERATE FINGERPRINT
    // =====================================================

    const fingerprint =
      `${metadata?.ipAddress}-${metadata?.userAgent}-${metadata?.deviceName}`;

    // =====================================================
    // ✅ CREATE SESSION
    // =====================================================

    const temporaryRefreshToken =
  'temp-session-token';

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

    // =====================================================
    // ✅ ACCESS TOKEN
    // =====================================================

    const accessToken =
      this.tokenService.generateAccessToken(
        {
          sub: user.id,

          role: user.role,

          sessionId: session.id,
        },
      );

    // =====================================================
    // ✅ REFRESH TOKEN
    // =====================================================

    const refreshToken =
      this.tokenService.generateRefreshToken(
        {
          sub: user.id,

          sessionId: session.id,

          tokenVersion: 1,
        },
      );

    // =====================================================
    // ✅ ROTATE REFRESH TOKEN
    // =====================================================

    await this.sessionService.rotateRefreshToken(
      session.id,

      refreshToken,
    );

    // =====================================================
    // ✅ RESPONSE
    // =====================================================

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

        role: user.role,
      },
    };
  }
}