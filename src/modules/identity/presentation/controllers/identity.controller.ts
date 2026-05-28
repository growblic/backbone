import {
  BadRequestException,
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

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';

import { StartRegisterDto } from '../dto/auth/register/start-register.dto';

import { VerifyRegisterDto } from '../dto/auth/register/verify-register.dto';

import { StartLoginDto } from '../dto/auth/login/start-login.dto';

import { VerifyLoginDto } from '../dto/auth/login/verify-login.dto';

import { RefreshTokenDto } from '../dto/auth/token/refresh-token.dto';

import { LogoutDto } from '../dto/auth/logout/logout.dto';

@Controller('auth')
export class IdentityController {
  constructor(
    // 🔥 register
    private readonly startRegistrationUseCase:
      StartRegistrationUseCase,

    private readonly verifyRegistrationUseCase:
      VerifyRegistrationUseCase,

    // 🔥 login
    private readonly startLoginUseCase:
      StartLoginUseCase,

    private readonly verifyLoginUseCase:
      VerifyLoginUseCase,

    // 🔥 refresh
    private readonly refreshTokenUseCase:
      RefreshTokenUseCase,

    // 🔥 logout
    private readonly logoutUseCase:
      LogoutUseCase,
  ) {}

  // =========================================================
  // 🔥 TEST API
  // =========================================================

  @Post('test')

  testApi() {

    return {
      success: true,

      message:
        'Identity controller working perfectly',
    };
  }

  // =========================================================
  // 🔥 REGISTER
  // =========================================================

  @Post('register/start')
  async startRegister(
    @Body()
    body: StartRegisterDto,
  ) {

    await this.startRegistrationUseCase.execute(
      body.phone,
    );

    return {
      success: true,

      message:
        'Registration OTP sent successfully',
    };
  }

  // =========================================================
  // 🔥 VERIFY REGISTER
  // =========================================================

  @Post('register/verify')
  async verifyRegister(
    @Body()
    body: VerifyRegisterDto,
  ) {

    return this.verifyRegistrationUseCase.execute(
      body.phone,
      body.otp,
      body.country,
      body.source,
    );
  }

  // =========================================================
  // 🔥 LOGIN START
  // =========================================================

  @Post('login/start')
  async startLogin(
    @Body()
    body: StartLoginDto,
  ) {

    return this.startLoginUseCase.execute(
      body.phone,
    );
  }

  // =========================================================
  // 🔥 LOGIN VERIFY
  // =========================================================

  @Post('login/verify')
  async verifyLogin(
    @Body()
    body: VerifyLoginDto,

    @Req() req: any,
  ) {

    if (!body.source) {
      throw new BadRequestException(
        'source is required',
      );
    }

    return this.verifyLoginUseCase.execute(
      body.phone,

      body.otp,

      body.source,

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
    body: RefreshTokenDto,
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
    body: LogoutDto,
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
      success: true,

      message:
        'Protected route accessed successfully',

      user: req.user,
    };
  }
}