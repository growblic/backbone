import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { OtpService } from '@infra/sms/services/otp.service';

@Injectable()
export class StartLoginUseCase {
  private readonly logger =
    new Logger(
      StartLoginUseCase.name,
    );

  constructor(
    private readonly otpService:
      OtpService,
  ) {}

  async execute(phone: string) {
    // =====================================================
    // ✅ REQUEST RECEIVED
    // =====================================================

    this.logger.log(
      `📲 LOGIN OTP REQUEST => ${phone}`,
    );

    // =====================================================
    // ✅ GENERATE OTP
    // =====================================================

    const otp =
      this.otpService.generateOtp();

    this.logger.log(
      `🔐 GENERATED OTP => ${otp}`,
    );

    // =====================================================
    // ✅ SAVE OTP IN REDIS
    // =====================================================

    await this.otpService.saveOtp(
      phone,
      otp,
      300,
    );

    this.logger.log(
      `💾 OTP SAVED IN REDIS`,
    );

    // =====================================================
    // ✅ SEND OTP SMS
    // =====================================================

    await this.otpService.sendOtp(
      phone,
      otp,
      'login',
    );

    this.logger.log(
      `📤 LOGIN OTP SENT`,
    );

    // =====================================================
    // ✅ RESPONSE
    // =====================================================

    return {
      success: true,

      message:
        'OTP sent successfully',
    };
  }
}