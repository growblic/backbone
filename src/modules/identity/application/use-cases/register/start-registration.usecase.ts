import { Injectable } from '@nestjs/common';

import { OtpService } from '@infra/sms/services/otp.service';

import { OtpRateLimitService } from '@infra/sms/services/otp-rate-limit.service';

@Injectable()
export class StartRegistrationUseCase {
  constructor(
    private readonly otpService: OtpService,

    private readonly otpRateLimitService:
      OtpRateLimitService,
  ) {}

  async execute(
    phone: string,
  ): Promise<any> {
    try {

      // =====================================================
      // ✅ RATE LIMIT
      // =====================================================

      await this.otpRateLimitService.checkOtpLimit(
        phone,
      );

      // =====================================================
      // ✅ GENERATE OTP
      // =====================================================

      const otp =
        this.otpService.generateOtp();

      // =====================================================
      // ✅ SAVE OTP
      // =====================================================

      await this.otpService.saveOtp(
        phone,
        otp,
        300,
      );

      // =====================================================
      // ✅ SEND SMS
      // =====================================================

      const smsResponse =
        await this.otpService.sendOtp(
          phone,
          otp,
          'registration',
        );

      return {
        success: true,

        message:
          'Registration OTP sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}