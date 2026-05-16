import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisService
  implements
    OnModuleInit,
    OnModuleDestroy
{
  private readonly logger =
    new Logger(RedisService.name);

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  // =====================================================
  // ✅ MODULE INIT
  // =====================================================

  async onModuleInit() {
    try {
      const pong =
        await this.redis.ping();

      this.logger.log(
        `✅ Redis Connected: ${pong}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ Redis Connection Failed',
        error,
      );
    }

    // ✅ Redis Events
    this.redis.on(
      'connect',
      () => {
        this.logger.log(
          '🟢 Redis connect event fired',
        );
      },
    );

    this.redis.on(
      'ready',
      () => {
        this.logger.log(
          '🚀 Redis ready',
        );
      },
    );

    this.redis.on(
      'error',
      (error) => {
        this.logger.error(
          '❌ Redis Error',
          error,
        );
      },
    );

    this.redis.on(
      'close',
      () => {
        this.logger.warn(
          '🟠 Redis connection closed',
        );
      },
    );

    this.redis.on(
      'reconnecting',
      () => {
        this.logger.warn(
          '🔄 Redis reconnecting...',
        );
      },
    );
  }

  // =====================================================
  // ✅ MODULE DESTROY
  // =====================================================

  async onModuleDestroy() {
    await this.redis.quit();

    this.logger.log(
      '🔴 Redis connection closed',
    );
  }

  // =====================================================
  // ✅ GET RAW CLIENT
  // =====================================================

  getClient(): Redis {
    return this.redis;
  }

  // =====================================================
  // ✅ SET VALUE
  // =====================================================

  async set(
    key: string,

    value: string,

    ttlSeconds?: number,
  ): Promise<void> {
    try {
      this.logger.log(
        `💾 REDIS SET => ${key}`,
      );

      if (ttlSeconds) {
        await this.redis.set(
          key,
          value,
          'EX',
          ttlSeconds,
        );
      } else {
        await this.redis.set(
          key,
          value,
        );
      }

      // ✅ Verify Immediately
      const verify =
        await this.redis.get(key);

      this.logger.log(
        `✅ REDIS SAVED => ${key} = ${verify}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ REDIS SET FAILED => ${key}`,
        error,
      );

      throw new InternalServerErrorException(
        'Redis SET failed',
      );
    }
  }

  // =====================================================
  // ✅ GET VALUE
  // =====================================================

  async get(
    key: string,
  ): Promise<string | null> {
    try {
      this.logger.log(
        `📥 REDIS GET => ${key}`,
      );

      const value =
        await this.redis.get(key);

      this.logger.log(
        `📦 REDIS VALUE => ${value}`,
      );

      return value;
    } catch (error) {
      this.logger.error(
        `❌ REDIS GET FAILED => ${key}`,
        error,
      );

      throw new InternalServerErrorException(
        'Redis GET failed',
      );
    }
  }

  // =====================================================
  // ✅ DELETE VALUE
  // =====================================================

  async del(
    key: string,
  ): Promise<number> {
    try {
      this.logger.log(
        `🗑️ REDIS DELETE => ${key}`,
      );

      return await this.redis.del(
        key,
      );
    } catch (error) {
      this.logger.error(
        `❌ REDIS DELETE FAILED => ${key}`,
        error,
      );

      throw new InternalServerErrorException(
        'Redis DELETE failed',
      );
    }
  }

  // =====================================================
  // ✅ INCREMENT
  // =====================================================

  async incr(
    key: string,
  ): Promise<number> {
    try {
      this.logger.log(
        `➕ REDIS INCR => ${key}`,
      );

      return await this.redis.incr(
        key,
      );
    } catch (error) {
      this.logger.error(
        `❌ REDIS INCR FAILED => ${key}`,
        error,
      );

      throw new InternalServerErrorException(
        'Redis INCR failed',
      );
    }
  }

  // =====================================================
  // ✅ EXPIRE
  // =====================================================

  async expire(
    key: string,

    seconds: number,
  ): Promise<number> {
    try {
      this.logger.log(
        `⏳ REDIS EXPIRE => ${key}`,
      );

      return await this.redis.expire(
        key,
        seconds,
      );
    } catch (error) {
      this.logger.error(
        `❌ REDIS EXPIRE FAILED => ${key}`,
        error,
      );

      throw new InternalServerErrorException(
        'Redis EXPIRE failed',
      );
    }
  }

  // =====================================================
  // ✅ TTL
  // =====================================================

  async ttl(
    key: string,
  ): Promise<number> {
    try {
      this.logger.log(
        `⌛ REDIS TTL => ${key}`,
      );

      return await this.redis.ttl(
        key,
      );
    } catch (error) {
      this.logger.error(
        `❌ REDIS TTL FAILED => ${key}`,
        error,
      );

      throw new InternalServerErrorException(
        'Redis TTL failed',
      );
    }
  }

  // =====================================================
  // ✅ HEALTH CHECK
  // =====================================================

  async ping(): Promise<string> {
    try {
      return await this.redis.ping();
    } catch (error) {
      this.logger.error(
        '❌ REDIS PING FAILED',
        error,
      );

      throw new InternalServerErrorException(
        'Redis ping failed',
      );
    }
  }
}