import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '@infra/prisma/prisma.module';

import { AdminAuthController } from './presentation/controllers/admin-auth.controller';

import { AdminTestController } from './presentation/controllers/admin-test.controller';

import { AdminUsersController } from './presentation/controllers/admin-users.controller';

import { AdminUsersPrismaRepository } from './infrastructure/repositories/admin-user.prisma.repository';

import { AdminSessionPrismaRepository } from './infrastructure/repositories/admin-session.prisma.repository';

import { AdminJwtService } from './infrastructure/services/admin-jwt.service';
import { GetAdminUserDetailsUseCase } from './application/use-cases/get-admin-user-details.usecase';

import { AdminJwtStrategy } from './infrastructure/strategies/admin-jwt.strategy';

import { AdminRefreshTokenUseCase } from './application/use-cases/admin-refresh-token.usecase';

import { AdminLogoutUseCase } from './application/use-cases/admin-logout.usecase';

import { GetAdminUsersUseCase } from './application/use-cases/get-admin-users.usecase';

@Module({
  imports: [
    PrismaModule,

    PassportModule,

    JwtModule.register({}),
  ],

  controllers: [
    AdminAuthController,

    AdminTestController,

    AdminUsersController,
  ],

  providers: [
    AdminUsersPrismaRepository,

    AdminSessionPrismaRepository,

    AdminJwtService,

    AdminJwtStrategy,

    AdminRefreshTokenUseCase,

    AdminLogoutUseCase,

    GetAdminUsersUseCase,

    GetAdminUserDetailsUseCase,
  ],

  exports: [
    AdminJwtService,

    AdminUsersPrismaRepository,
  ],
})
export class AdminAuthModule {}