import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

// 🔥 Infrastructure
import { PrismaModule } from '@infra/prisma/prisma.module';
import { EventsModule } from '@infra/events/events.module';
import { RedisModule } from '@infra/redis/redis.module';

// 🔥 Core App
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 🔥 Business Modules
import { IdentityModule } from '@modules/identity/identity.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { WalletsModule } from '@modules/wallets/wallets.module';
import { TaskCatalogModule } from '@modules/task-catalog/task-catalog.module';
import { TaskSubmissionsModule } from '@modules/task-submissions/task-submissions.module';
import { AdRewardsModule } from '@modules/ad-rewards/ad-rewards.module';

@Module({
  imports: [
    // 🗄️ Database
    PrismaModule,
    TaskSubmissionsModule,
    AdRewardsModule,

    // ⚡ Redis (Sessions / Cache / Rate Limit)
    RedisModule,

    // 📡 Event Bus
    EventEmitterModule.forRoot(),
    EventsModule,

    // 🧩 Business Modules
    IdentityModule,
    ProfilesModule,
    WalletsModule,
    TaskCatalogModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}