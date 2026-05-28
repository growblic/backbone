import {
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UserRepository }
from '@modules/identity/domain/repositories/user.repository';

import { TokenService }
from '@modules/identity/application/services/token.service';

import { SessionService }
from '@modules/identity/application/services/session.service';

@Injectable()
export class AdminLoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo:
      UserRepository,

    private readonly tokenService:
      TokenService,

    private readonly sessionService:
      SessionService,
  ) {}

  async execute(
    email: string,
    password: string,

    metadata?: {
      ipAddress?: string;

      userAgent?: string;

      deviceName?: string;
    },
  ) {
    // ✅ FIND USER

    const user =
      await this.userRepo.findByEmail(
        email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    // ✅ CHECK PASSWORD

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.passwordHash || '',
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    // ✅ CHECK ROLE

    if (
      user.role !== 'SUPER_ADMIN'
    ) {
      throw new UnauthorizedException(
        'Admin access denied',
      );
    }

    // ✅ CREATE ACCESS TOKEN

    const accessToken =
      this.tokenService.generateAccessToken(
        {
          sub: user.id,

          role: user.role,

          sessionId: 'admin',
        },
      );

    // ✅ CREATE REFRESH TOKEN

    const refreshToken =
      this.tokenService.generateRefreshToken(
        {
          sub: user.id,

          sessionId: 'admin',
        },
      );

    // ✅ CREATE SESSION

    await this.sessionService.createSession(
      user.id,
      refreshToken,
      {
        ipAddress:
          metadata?.ipAddress,

        userAgent:
          metadata?.userAgent,

        deviceName:
          metadata?.deviceName,

        fingerprint:
          `${metadata?.ipAddress}-${metadata?.userAgent}`,
      },
    );

    return {
      accessToken,

      refreshToken,

      user: {
        id: user.id,

        email: user.email,

        role: user.role,
      },
    };
  }
}