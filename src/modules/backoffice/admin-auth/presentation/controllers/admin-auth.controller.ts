import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminLogoutDto } from '../dto/admin-logout.dto';
import { AdminRefreshTokenDto } from '../dto/admin-refresh-token.dto';

import { AdminRefreshTokenUseCase } from '../../application/use-cases/admin-refresh-token.usecase';

import { AdminUsersPrismaRepository } from '../../infrastructure/repositories/admin-user.prisma.repository';

import { AdminSessionPrismaRepository } from '../../infrastructure/repositories/admin-session.prisma.repository';

import { AdminJwtService } from '../../infrastructure/services/admin-jwt.service';
import { AdminLogoutUseCase } from '@modules/backoffice/admin-auth/application/use-cases/admin-logout.usecase';

@Controller({
  path: 'backoffice/auth',
  version: '1',
})
export class AdminAuthController {
  constructor(
    private readonly adminRepository: AdminUsersPrismaRepository,

    private readonly jwtService: AdminJwtService,

    private readonly adminSessionRepository: AdminSessionPrismaRepository,

    private readonly adminRefreshTokenUseCase: AdminRefreshTokenUseCase,

    private readonly adminLogoutUseCase: AdminLogoutUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body()
    dto: AdminLoginDto,
  ) {
    const admin =
      await this.adminRepository.findByEmail(
        dto.email,
      );

    if (!admin) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        dto.password,
        admin.passwordHash,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const accessToken =
      await this.jwtService.generateAccessToken(
        admin.id,
        admin.email,
        admin.role,
      );

    const refreshToken =
      await this.jwtService.generateRefreshToken(
        admin.id,
        admin.email,
        admin.role,
      );

      await this.adminSessionRepository.create({
        adminId: admin.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

    return {
      success: true,

      data: {
        accessToken,
        refreshToken,

        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
        },
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto:
    AdminRefreshTokenDto,
  ) {
    const result =
      await this.adminRefreshTokenUseCase.execute(
        dto.refreshToken,
      );

    return {
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    };
  }

 @Post('logout')
@HttpCode(HttpStatus.OK)
async logout(
  @Body() dto: AdminLogoutDto,
) {
  await this.adminLogoutUseCase.execute(
    dto.refreshToken,
  );

  return {
    success: true,

    message:
      'Logged out successfully',
  };
}
      }