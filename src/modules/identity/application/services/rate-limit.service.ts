import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RateLimitService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  // 🔥 OTP RATE LIMIT
  async checkOtpLimit(phone: string) {
    const key = `otp:${phone}`;

    const current = await this.redis.get(key);

    // ✅ first request
    if (!current) {
      await this.redis.set(key, 1, 'EX', 600); // 10 min
      return;
    }

    const count = Number(current);

    // 🚨 limit reached
    if (count >= 5) {
      throw new HttpException(
        'Too many OTP requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // ➕ increment request count
    await this.redis.incr(key);
  }
}