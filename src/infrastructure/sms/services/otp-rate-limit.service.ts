import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { RedisService } from '@infra/redis/redis.service';

import { SMS_CONSTANTS } from '../constants/sms.constants';

@Injectable()
export class OtpRateLimitService {
  constructor(
    private readonly redisService:
      RedisService,
  ) {}

  async checkOtpLimit(
    phone: string,
  ): Promise<void> {
    await this.checkResendCooldown(
      phone,
    );

    await this.checkHourlyLimit(
      phone,
    );
  }

  async checkResendCooldown(
    phone: string,
  ): Promise<void> {
    const redis =
      this.redisService.getClient();

    const key =
      `${SMS_CONSTANTS.REDIS_KEYS.OTP_RESEND}:${phone}`;

    const exists =
      await redis.get(key);

    if (exists) {
      throw new BadRequestException(
        'Please wait before requesting another OTP',
      );
    }

    await redis.set(
      key,
      '1',
      'EX',
      SMS_CONSTANTS.OTP.RESEND_COOLDOWN_SECONDS,
    );
  }

  async checkHourlyLimit(
    phone: string,
  ): Promise<void> {
    const redis =
      this.redisService.getClient();

    const key =
      `${SMS_CONSTANTS.REDIS_KEYS.OTP_HOURLY_LIMIT}:${phone}`;

    const count =
      await redis.incr(key);

    if (count === 1) {
      await redis.expire(
        key,
        3600,
      );
    }

    if (
      count >
      SMS_CONSTANTS.OTP.MAX_PER_HOUR
    ) {
      throw new BadRequestException(
        'Hourly OTP limit exceeded',
      );
    }
  }
}