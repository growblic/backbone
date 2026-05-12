import {
  Module,
  forwardRef,
} from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

// Infra
import { PrismaModule } from '@infra/prisma/prisma.module';

import { UserPrismaRepository } from '@modules/identity/infrastructure/user.prisma.repository';

// Modules
import { ProfilesModule } from '@modules/profiles/profiles.module';

import { WalletsModule } from '@modules/wallets/wallets.module';

// Services
import { OtpService } from '@modules/identity/application/services/otp.service';

import { TokenService } from '@modules/identity/application/services/token.service';

import { SessionService } from '@modules/identity/application/services/session.service';

import { RateLimitService } from '@modules/identity/application/services/rate-limit.service';

// Register UseCases
import { CreateUserUseCase } from '@modules/identity/application/use-cases/register/create-user.usecase';

import { StartRegistrationUseCase } from '@modules/identity/application/use-cases/register/start-registration.usecase';

import { VerifyRegistrationUseCase } from '@modules/identity/application/use-cases/register/verify-registration.usecase';

// Login UseCases
import { StartLoginUseCase } from '@modules/identity/application/use-cases/auth/start-login.usecase';

import { VerifyLoginUseCase } from '@modules/identity/application/use-cases/auth/verify-login.usecase';

import { RefreshTokenUseCase } from '@modules/identity/application/use-cases/auth/refresh-token.usecase';

import { LogoutUseCase } from '@modules/identity/application/use-cases/auth/logout.usecase';

import { GetSessionsUseCase } from '@modules/identity/application/use-cases/auth/get-sessions.usecase';

import { RevokeSessionUseCase } from '@modules/identity/application/use-cases/auth/revoke-session.usecase';

import { LogoutAllDevicesUseCase } from '@modules/identity/application/use-cases/auth/logout-all-devices.usecase';

// Controllers
import { IdentityController } from '@modules/identity/presentation/controllers/identity.controller';

import { MeController } from '@modules/identity/presentation/controllers/me.controller';

import { SessionController } from '@modules/identity/presentation/controllers/session.controller';

import { AdminController } from '@modules/identity/presentation/controllers/admin.controller';

// Guards
import { JwtAuthGuard } from '@modules/identity/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@modules/identity/presentation/guards/roles.guard';

@Module({
  imports: [
    PrismaModule,
    WalletsModule,

    forwardRef(
      () => ProfilesModule,
    ),

    JwtModule.register({}),
  ],

  controllers: [
    IdentityController,

    MeController,

    SessionController,

    AdminController,
  ],

  providers: [
    // Infrastructure
    UserPrismaRepository,

    // Repository Binding
    {
      provide: 'UserRepository',

      useExisting:
        UserPrismaRepository,
    },

    // Services
    OtpService,

    TokenService,

    SessionService,

    RateLimitService,

    // Guards
    JwtAuthGuard,

    RolesGuard,

    // Register
    CreateUserUseCase,

    StartRegistrationUseCase,

    VerifyRegistrationUseCase,

    // Login
    StartLoginUseCase,

    VerifyLoginUseCase,

    RefreshTokenUseCase,

    LogoutUseCase,

    GetSessionsUseCase,

    RevokeSessionUseCase,

    LogoutAllDevicesUseCase,
  ],

  exports: [
    TokenService,

    SessionService,

    JwtAuthGuard,

    // Register
    CreateUserUseCase,

    StartRegistrationUseCase,

    VerifyRegistrationUseCase,

    // Login
    StartLoginUseCase,

    VerifyLoginUseCase,

    RefreshTokenUseCase,

    LogoutUseCase,

    GetSessionsUseCase,
  ],
})
export class IdentityModule {}