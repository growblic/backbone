import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { BackofficeModule } from '@modules/backoffice/backoffice.module';

import { ConfigModule } from '@nestjs/config';

import { EventEmitterModule } from '@nestjs/event-emitter';

import { RequestMethod } from '@nestjs/common';

import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';


// ⚙️ CONFIG

import { envValidationSchema }
from '@config/validation/env.validation';


// 🏗️ INFRASTRUCTURE

import { PrismaModule }
from '@infra/prisma/prisma.module';

import { RedisModule }
from '@infra/redis/redis.module';

import { EventsModule }
from '@infra/events/events.module';

import { LoggerModule }
from '@infra/logger/logger.module';


// 🧱 CORE APP

import { AppController }
from './app.controller';

import { AppService }
from './app.service';

// =====================================================
// 🧩 BUSINESS MODULES
// =====================================================

import { IdentityModule }
from '@modules/identity/identity.module';

import { ProfilesModule }
from '@modules/profiles/profiles.module';

import { WalletsModule }
from '@modules/wallets/wallets.module';

import { TaskCatalogModule }
from '@modules/task-catalog/task-catalog.module';

import { TaskSubmissionsModule }
from '@modules/task-submissions/task-submissions.module';

import { AdRewardsModule }
from '@modules/ad-rewards/ad-rewards.module';

// =====================================================
// 🛡️ MIDDLEWARE
// =====================================================

import { LoggerMiddleware }
from '@common/middleware/logger.middleware';

import { RequestIdMiddleware }
from '@common/middleware/request-id.middleware';

import { PermissionsGuard } from '@common/guards/authorization/permissions.guard';

@Module({
  imports: [
    // =====================================================
    // ⚙️ CONFIG
    // =====================================================

    ConfigModule.forRoot({
      isGlobal: true,

      cache: true,

      expandVariables: true,

      validationSchema:
        envValidationSchema,
    }),

    // =====================================================
    // 🗄️ DATABASE
    // =====================================================

    PrismaModule,

    // =====================================================
    // 📝 LOGGER
    // =====================================================

    LoggerModule,

    // =====================================================
    // ⚡ REDIS / CACHE
    // =====================================================

    RedisModule,

    // =====================================================
    // 🚦 RATE LIMITING
    // =====================================================

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),

    // =====================================================
    // 📡 EVENTS
    // =====================================================

    EventEmitterModule.forRoot(),

    EventsModule,

    // =====================================================
    // 🧩 BUSINESS MODULES
    // =====================================================

    IdentityModule,

    ProfilesModule,

    WalletsModule,

    TaskCatalogModule,

    TaskSubmissionsModule,

    AdRewardsModule,

    BackofficeModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,

    // =====================================================
    // 🌍 GLOBAL RATE LIMITER
    // =====================================================

    {
      provide: APP_GUARD,

      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,

      useClass: PermissionsGuard,
    },
  ],
})

export class AppModule
  implements NestModule
{
  configure(
  consumer: MiddlewareConsumer,
): void {
  consumer
    .apply(
      RequestIdMiddleware,
      LoggerMiddleware,
    )
    .forRoutes({
      path: '*path.',
      method: RequestMethod.ALL,
    });
}
}