import { Module } from '@nestjs/common';

import { WinstonModule } from 'nest-winston';

import { winstonConfig } from './winston-logger.config';

import { AppLoggerService } from './app-logger.service';

@Module({
  imports: [
    WinstonModule.forRoot(
      winstonConfig,
    ),
  ],

  providers: [AppLoggerService],

  exports: [
    WinstonModule,

    AppLoggerService,
  ],
})
export class LoggerModule {}