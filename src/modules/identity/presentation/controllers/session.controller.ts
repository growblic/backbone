import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@modules/identity/presentation/guards/jwt-auth.guard';

import { CurrentUser } from '@common/decorators/current-user.decorator';

import { GetSessionsUseCase } from '@modules/identity/application/use-cases/auth/get-sessions.usecase';

import { RevokeSessionUseCase } from '@modules/identity/application/use-cases/auth/revoke-session.usecase';

import { LogoutAllDevicesUseCase } from '@modules/identity/application/use-cases/auth/logout-all-devices.usecase';

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly getSessionsUseCase: GetSessionsUseCase,

    private readonly revokeSessionUseCase: RevokeSessionUseCase,

    private readonly logoutAllDevicesUseCase: LogoutAllDevicesUseCase,
  ) {}

  // ✅ GET ALL SESSIONS
  @Get()
  @UseGuards(JwtAuthGuard)
  async getSessions(
    @CurrentUser() user: any,
  ) {
    return this.getSessionsUseCase.execute(
      user.sub,
    );
  }

  // ✅ REVOKE SINGLE SESSION
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async revokeSession(
    @CurrentUser() user: any,

    @Param('id') sessionId: string,
  ) {
    return this.revokeSessionUseCase.execute(
      user.sub,
      sessionId,
    );
  }

  // ✅ LOGOUT ALL DEVICES
  @Delete()
  @UseGuards(JwtAuthGuard)
  async logoutAllDevices(
    @CurrentUser() user: any,
  ) {
    return this.logoutAllDevicesUseCase.execute(
      user.sub,
    );
  }
}