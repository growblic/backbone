import { Module } from '@nestjs/common';

import { RedisModule } from '@infra/redis/redis.module';

import { SmsService } from './sms.service';

import { SmsRouterService } from './router/sms-router.service';

import { OtpService } from './services/otp.service';

import { OtpRateLimitService } from './services/otp-rate-limit.service';

import { SmsGatewayHubProvider } from './providers/sms-gateway-hub/sms-gateway-hub.provider';

@Module({
  imports: [
    RedisModule,
  ],

  providers: [
    SmsService,

    SmsRouterService,

    OtpService,

    OtpRateLimitService,

    SmsGatewayHubProvider,
  ],

  exports: [
    SmsService,

    OtpService,

    OtpRateLimitService,
  ],
})
export class SmsModule {}