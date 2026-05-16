import * as winston from 'winston';

import 'winston-daily-rotate-file';

const DailyRotateFile =
  winston.transports.DailyRotateFile;

export const winstonConfig =
  winston.createLogger({
    level: 'info',

    format:
      winston.format.combine(
        winston.format.timestamp(),

        winston.format.errors({
          stack: true,
        }),

        winston.format.json(),
      ),

    transports: [
      // =====================================================
      // ✅ CONSOLE LOGS
      // =====================================================

      new winston.transports.Console({
        format:
          winston.format.combine(
            winston.format.colorize(),

            winston.format.timestamp(),

            winston.format.printf(
              ({
                level,
                message,
                timestamp,
              }) =>
                `[${timestamp}] ${level}: ${message}`,
            ),
          ),
      }),

      // =====================================================
      // ❌ ERROR LOGS
      // =====================================================

      new DailyRotateFile({
        level: 'error',

        dirname: 'logs/error',

        filename:
          '%DATE%-error.log',

        datePattern: 'YYYY-MM-DD',

        zippedArchive: true,

        maxSize: '20m',

        maxFiles: '30d',
      }),

      // =====================================================
      // ✅ COMBINED LOGS
      // =====================================================

      new DailyRotateFile({
        dirname: 'logs/combined',

        filename:
          '%DATE%-combined.log',

        datePattern: 'YYYY-MM-DD',

        zippedArchive: true,

        maxSize: '20m',

        maxFiles: '30d',
      }),
    ],
  });