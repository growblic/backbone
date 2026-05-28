import {
  Module,
  forwardRef,
} from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';

// =====================================================
// 🔥 INFRASTRUCTURE
// =====================================================

import { PrismaModule } from '@infra/prisma/prisma.module';

import { SmsModule } from '@infra/sms/sms.module';

// =====================================================
// 🔥 REPOSITORIES
// =====================================================

import { UserPrismaRepository } from '@modules/identity/infrastructure/user.prisma.repository';

// =====================================================
// 🔥 STRATEGIES
// =====================================================

import { JwtStrategy } from '@modules/identity/infrastructure/strategies/jwt.strategy';

// =====================================================
// 🔥 MODULES
// =====================================================

import { ProfilesModule } from '@modules/profiles/profiles.module';

import { WalletsModule } from '@modules/wallets/wallets.module';

// =====================================================
// 🔥 SERVICES
// =====================================================

import { TokenService } from '@modules/identity/application/services/token.service';

import { SessionService } from '@modules/identity/application/services/session.service';

import { RateLimitService } from '@modules/identity/application/services/rate-limit.service';

import { UserCreatorService } from '@modules/identity/application/services/user-creator.service';

// =====================================================
// 🔥 REGISTER USE CASES
// =====================================================

import { CreateUserUseCase } from '@modules/identity/application/use-cases/register/create-user.usecase';

import { StartRegistrationUseCase } from '@modules/identity/application/use-cases/register/start-registration.usecase';

import { VerifyRegistrationUseCase } from '@modules/identity/application/use-cases/register/verify-registration.usecase';

// =====================================================
// 🔥 AUTH USE CASES
// =====================================================

import { StartLoginUseCase } from '@modules/identity/application/use-cases/auth/start-login.usecase';

import { VerifyLoginUseCase } from '@modules/identity/application/use-cases/auth/verify-login.usecase';

import { RefreshTokenUseCase } from '@modules/identity/application/use-cases/auth/refresh-token.usecase';

import { LogoutUseCase } from '@modules/identity/application/use-cases/auth/logout.usecase';

import { GetSessionsUseCase } from '@modules/identity/application/use-cases/auth/get-sessions.usecase';

import { RevokeSessionUseCase } from '@modules/identity/application/use-cases/auth/revoke-session.usecase';

import { LogoutAllDevicesUseCase } from '@modules/identity/application/use-cases/auth/logout-all-devices.usecase';

// =====================================================
// 🔥 CONTROLLERS
// =====================================================

import { IdentityController } from '@modules/identity/presentation/controllers/identity.controller';

import { MeController } from '@modules/identity/presentation/controllers/me.controller';

import { SessionController } from '@modules/identity/presentation/controllers/session.controller';


// =====================================================
// 🔥 GUARDS
// =====================================================

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';

import { RolesGuard } from '@common/guards/authorization/roles.guard';

@Module({
  imports: [
    // =====================================================
    // 🗄️ DATABASE
    // =====================================================

    PrismaModule,

    // =====================================================
    // 📲 SMS
    // =====================================================

    SmsModule,

    // =====================================================
    // 👤 PROFILE / WALLET MODULES
    // =====================================================

    WalletsModule,

    forwardRef(
      () => ProfilesModule,
    ),

    // =====================================================
    // 🔐 PASSPORT
    // =====================================================

    PassportModule,

    // =====================================================
    // 🔐 JWT
    // =====================================================

    JwtModule.register({
      secret:
        process.env.JWT_ACCESS_SECRET,

      signOptions: {
        expiresIn:
          (process.env.JWT_ACCESS_EXPIRES_IN ||
          '15m') as any,
      },
    }),
  ],

  controllers: [
    IdentityController,

    MeController,

    SessionController,

    
  ],

  providers: [
    // =====================================================
    // 🗄️ REPOSITORIES
    // =====================================================

    UserPrismaRepository,

    {
      provide: 'UserRepository',

      useExisting:
        UserPrismaRepository,
    },

    // =====================================================
    // 🔥 SERVICES
    // =====================================================

    TokenService,

    SessionService,

    RateLimitService,

    UserCreatorService,

    // =====================================================
    // 🔐 AUTH STRATEGIES
    // =====================================================

    JwtStrategy,

    // =====================================================
    // 🛡️ GUARDS
    // =====================================================

    JwtAuthGuard,

    RolesGuard,

    // =====================================================
    // 👤 REGISTER FLOW
    // =====================================================

    CreateUserUseCase,

    StartRegistrationUseCase,

    VerifyRegistrationUseCase,

    // =====================================================
    // 🔑 LOGIN FLOW
    // =====================================================

    StartLoginUseCase,

    VerifyLoginUseCase,

    RefreshTokenUseCase,

    LogoutUseCase,

    GetSessionsUseCase,

    RevokeSessionUseCase,

    LogoutAllDevicesUseCase,
  ],

  exports: [
    // =====================================================
    // 🔥 SERVICES
    // =====================================================

    TokenService,

    SessionService,

    // =====================================================
    // 🛡️ GUARDS
    // =====================================================

    JwtAuthGuard,

    RolesGuard,

    // =====================================================
    // 👤 REGISTER FLOW
    // =====================================================

    CreateUserUseCase,

    StartRegistrationUseCase,

    VerifyRegistrationUseCase,

    // =====================================================
    // 🔑 LOGIN FLOW
    // =====================================================

    StartLoginUseCase,

    VerifyLoginUseCase,

    RefreshTokenUseCase,

    LogoutUseCase,

    GetSessionsUseCase,
  ],
})
export class IdentityModule {}