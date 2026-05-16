import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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

@ApiTags('Identity / Authentication')
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
  @ApiOperation({
    summary: 'Test API',
    description:
      'Simple test endpoint for checking controller',
  })
  @ApiResponse({
    status: 200,
    description:
      'API working successfully',
  })
  testApi() {
    console.log(
      '🔥 TEST API HIT',
    );

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
  @ApiOperation({
    summary: 'Start user registration',
    description:
      'Send OTP for new user registration',
  })
  @ApiBody({
    type: StartRegisterDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Registration OTP sent successfully',
  })
  async startRegister(
    @Body()
    body: StartRegisterDto,
  ) {
    console.log(
      '🔥 REGISTER START API HIT',
    );

    console.log(body);

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
  @ApiOperation({
    summary: 'Verify registration OTP',
    description:
      'Verify OTP and create new user account',
  })
  @ApiBody({
    type: VerifyRegisterDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully',
  })
  async verifyRegister(
    @Body()
    body: VerifyRegisterDto,
  ) {
    console.log(
      '🔥 VERIFY REGISTER API HIT',
    );

    console.log(body);

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
  @ApiOperation({
    summary: 'Start user login',
    description:
      'Send OTP for user login',
  })
  @ApiBody({
    type: StartLoginDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Login OTP sent successfully',
  })
  async startLogin(
    @Body()
    body: StartLoginDto,
  ) {
    console.log(
      '🔥 LOGIN START API HIT',
    );

    console.log(body);

    return this.startLoginUseCase.execute(
      body.phone,
    );
  }

  // =========================================================
  // 🔥 LOGIN VERIFY
  // =========================================================

  @Post('login/verify')
  @ApiOperation({
    summary: 'Verify login OTP',
    description:
      'Verify OTP and generate access tokens',
  })
  @ApiBody({
    type: VerifyLoginDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'User logged in successfully',
  })
  async verifyLogin(
    @Body()
    body: VerifyLoginDto,

    @Req() req: any,
  ) {
    console.log(
      '🔥 LOGIN VERIFY API HIT',
    );

    console.log(body);

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
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Generate new access token using refresh token',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Access token refreshed successfully',
  })
  async refresh(
    @Body()
    body: RefreshTokenDto,
  ) {
    console.log(
      '🔥 REFRESH TOKEN API HIT',
    );

    console.log(body);

    return this.refreshTokenUseCase.execute(
      body.refreshToken,
    );
  }

  // =========================================================
  // 🔥 LOGOUT
  // =========================================================

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logout current session and invalidate tokens',
  })
  @ApiBody({
    type: LogoutDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'User logged out successfully',
  })
  async logout(
    @Body()
    body: LogoutDto,
  ) {
    console.log(
      '🔥 LOGOUT API HIT',
    );

    console.log(body);

    return this.logoutUseCase.execute(
      body.sessionId,
    );
  }

  // =========================================================
  // 🔥 PROTECTED TEST ROUTE
  // =========================================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description:
      'Protected route to get authenticated user details',
  })
  @ApiResponse({
    status: 200,
    description:
      'Protected route accessed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async me(@Req() req: any) {
    console.log(
      '🔥 PROTECTED ROUTE HIT',
    );

    return {
      success: true,

      message:
        'Protected route accessed successfully',

      user: req.user,
    };
  }
}