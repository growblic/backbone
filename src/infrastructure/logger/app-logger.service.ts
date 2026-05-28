import {
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER }
from 'nest-winston';

import { Logger }
from 'winston';

@Injectable()
export class AppLoggerService
  implements LoggerService
{
  constructor(
    @Inject(
      WINSTON_MODULE_PROVIDER,
    )
    private readonly logger: Logger,
  ) {}

  // =====================================================
  // ✅ LOG
  // =====================================================

  log(
    message: string,

    context?: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logger.info(message, {
      context,

      ...meta,
    });
  }

  // =====================================================
  // ❌ ERROR
  // =====================================================

  error(
    message: string,

    trace?: string,

    context?: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logger.error(message, {
      trace,

      context,

      ...meta,
    });
  }

  // =====================================================
  // ⚠️ WARN
  // =====================================================

  warn(
    message: string,

    context?: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logger.warn(message, {
      context,

      ...meta,
    });
  }

  // =====================================================
  // 🐛 DEBUG
  // =====================================================

  debug(
    message: string,

    context?: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logger.debug(message, {
      context,

      ...meta,
    });
  }

  // =====================================================
  // 📌 VERBOSE
  // =====================================================

  verbose(
    message: string,

    context?: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logger.verbose(message, {
      context,

      ...meta,
    });
  }

  // =====================================================
  // 🚨 FATAL
  // =====================================================

  fatal(
    message: string,

    trace?: string,

    context?: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logger.error(message, {
      level: 'fatal',

      trace,

      context,

      ...meta,
    });
  }
}