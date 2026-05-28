import {
  Global,
  Module,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        });
      },
    },

    RedisService,
  ],

  exports: [
    'REDIS_CLIENT',

    RedisService,
  ],
})
export class RedisModule {}