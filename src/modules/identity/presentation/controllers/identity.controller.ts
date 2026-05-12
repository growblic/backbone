import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { StartRegistrationUseCase } from '@modules/identity/application/use-cases/register/start-registration.usecase';
import { VerifyRegistrationUseCase } from '@modules/identity/application/use-cases/register/verify-registration.usecase';

import { StartLoginUseCase } from '@modules/identity/application/use-cases/auth/start-login.usecase';
import { VerifyLoginUseCase } from '@modules/identity/application/use-cases/auth/verify-login.usecase';

import { RefreshTokenUseCase } from '@modules/identity/application/use-cases/auth/refresh-token.usecase';

import { LogoutUseCase } from '@modules/identity/application/use-cases/auth/logout.usecase';

import { JwtAuthGuard } from '@modules/identity/presentation/guards/jwt-auth.guard';

@Controller('auth')
export class IdentityController {
  constructor(
    // 🔥 register
    private readonly startRegistrationUseCase: StartRegistrationUseCase,
    private readonly verifyRegistrationUseCase: VerifyRegistrationUseCase,

    // 🔥 login
    private readonly startLoginUseCase: StartLoginUseCase,
    private readonly verifyLoginUseCase: VerifyLoginUseCase,

    // 🔥 refresh
    private readonly refreshTokenUseCase: RefreshTokenUseCase,

    // 🔥 logout
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  // =========================================================
  // 🔥 REGISTER
  // =========================================================

  @Post('register/start')
  async startRegister(
    @Body()
    body: {
      phone: string;
    },
  ) {
    return this.startRegistrationUseCase.execute(
      body.phone,
    );
  }

  @Post('register/verify')
  async verifyRegister(
    @Body()
    body: {
      phone: string;
      otp: string;
      country: string;
      source: string;
    },
  ) {
    return this.verifyRegistrationUseCase.execute(
      body.phone,
      body.otp,
      body.country,
      body.source,
    );
  }

  // =========================================================
  // 🔥 LOGIN
  // =========================================================

  @Post('login/start')
  async startLogin(
    @Body()
    body: {
      phone: string;
    },
  ) {
    return this.startLoginUseCase.execute(
      body.phone,
    );
  }

  @Post('login/verify')
  async verifyLogin(
    @Body()
    body: {
      phone: string;
      otp: string;
    },

    @Req() req: any,
  ) {
    return this.verifyLoginUseCase.execute(
      body.phone,
      body.otp,

      {
        ipAddress:
          req.ip ||
          req.connection?.remoteAddress ||
          'unknown',

        userAgent:
          req.headers['user-agent'] ||
          'unknown',

        deviceName:
          req.headers['user-agent'] ||
          'unknown-device',
      },
    );
  }

  // =========================================================
  // 🔥 REFRESH TOKEN
  // =========================================================

  @Post('refresh')
  async refresh(
    @Body()
    body: {
      refreshToken: string;
    },
  ) {
    return this.refreshTokenUseCase.execute(
      body.refreshToken,
    );
  }

  // =========================================================
  // 🔥 LOGOUT
  // =========================================================

  @Post('logout')
  async logout(
    @Body()
    body: {
      sessionId: string;
    },
  ) {
    return this.logoutUseCase.execute(
      body.sessionId,
    );
  }

  // =========================================================
  // 🔥 PROTECTED TEST ROUTE
  // =========================================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return {
      message:
        'Protected route accessed successfully',

      user: req.user,
    };
  }
}