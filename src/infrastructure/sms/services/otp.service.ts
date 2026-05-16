import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RedisService } from '@infra/redis/redis.service';

import { SmsRouterService } from '@infra/sms/router/sms-router.service';

import { smsTemplates } from '@infra/sms/templates/sms.templates';

@Injectable()
export class OtpService {
  constructor(
    private readonly redisService:
      RedisService,

    private readonly smsRouterService:
      SmsRouterService,
  ) {}

  // =====================================================
  // ✅ GENERATE OTP
  // =====================================================

  generateOtp(): string {
    return Math.floor(
      1000 +
        Math.random() * 9000,
    ).toString();
  }

  // =====================================================
  // ✅ SAVE OTP
  // =====================================================

  async saveOtp(
    phone: string,

    otp: string,

    ttlSeconds: number,
  ) {
    const key = `otp:${phone}`;

    console.log(
      '💾 SAVING OTP =>',
      key,
      otp,
    );

    await this.redisService.set(
      key,

      otp,

      ttlSeconds,
    );
  }

  // =====================================================
  // ✅ VERIFY OTP
  // =====================================================

  async verifyOtp(
    phone: string,

    otp: string,
  ): Promise<boolean> {
    const key = `otp:${phone}`;

    console.log(
      '🔍 VERIFYING OTP =>',
      key,
    );

    const storedOtp =
      await this.redisService.get(
        key,
      );

    console.log(
      '📦 STORED OTP =>',
      storedOtp,
    );

    console.log(
      '📲 RECEIVED OTP =>',
      otp,
    );

    if (!storedOtp) {
      throw new UnauthorizedException(
        'OTP expired',
      );
    }

    const isValid =
      storedOtp.toString().trim() ===
      otp.toString().trim();

    console.log(
      '✅ OTP MATCH =>',
      isValid,
    );

    if (!isValid) {
      throw new UnauthorizedException(
        'Invalid OTP',
      );
    }

    return true;
  }

  // =====================================================
  // ✅ DELETE OTP
  // =====================================================

  async deleteOtp(
    phone: string,
  ) {
    const key = `otp:${phone}`;

    console.log(
      '🗑️ DELETING OTP =>',
      key,
    );

    await this.redisService.del(
      key,
    );
  }

  // =====================================================
  // ✅ SEND OTP SMS
  // =====================================================

  async sendOtp(
    phone: string,

    otp: string,

    type:
      | 'login'
      | 'registration'
      | 'reset-password',
  ) {
    const template =
      smsTemplates[type];

    const message =
      template.message.replace(
        '{{OTP}}',
        otp,
      );

    console.log(
      '📤 SENDING SMS TO =>',
      phone,
    );

    return this.smsRouterService.sendSms(
      {
        phone,

        message,

        templateId:
          template.templateId,

        entityId:
          process.env
            .SMS_GATEWAY_HUB_ENTITY_ID,
      },
    );
  }
}