import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { SmsRouterService } from './router/sms-router.service';

import { SmsGatewayHubProvider } from './providers/sms-gateway-hub/sms-gateway-hub.provider';

@Injectable()
export class SmsService
  implements OnModuleInit
{
  constructor(
    private readonly smsRouterService:
      SmsRouterService,

    private readonly smsGatewayHubProvider:
      SmsGatewayHubProvider,
  ) {}

  // =====================================================
  // 🔥 REGISTER PROVIDERS
  // =====================================================

  onModuleInit() {
    this.smsRouterService.registerProvider(
      this.smsGatewayHubProvider,
    );
  }

  // =====================================================
  // 🔥 SEND OTP
  // =====================================================

  async sendOtp(
    phone: string,
    otp: string,
  ) {
    const message =
      `Your OTP is ${otp}. Do not share it with anyone.`;

    return this.smsRouterService.sendSms(
      {
        phone,

        message,

        templateId:
          process.env.SMS_OTP_TEMPLATE_ID,

        entityId:
          process.env.SMS_ENTITY_ID,

        metadata: {
          type: 'OTP',
        },
      },
    );
  }

  // =====================================================
  // 🔥 SEND CUSTOM SMS
  // =====================================================

  async sendCustomSms(
    phone: string,
    message: string,
  ) {
    return this.smsRouterService.sendSms(
      {
        phone,

        message,
      },
    );
  }
}