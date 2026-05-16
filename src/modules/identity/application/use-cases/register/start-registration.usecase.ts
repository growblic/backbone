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
      console.log(
        '✅ STEP 1 => REQUEST RECEIVED',
      );

      console.log(
        'PHONE =>',
        phone,
      );

      // =====================================================
      // ✅ RATE LIMIT
      // =====================================================

      await this.otpRateLimitService.checkOtpLimit(
        phone,
      );

      console.log(
        '✅ STEP 2 => RATE LIMIT CHECKED',
      );

      // =====================================================
      // ✅ GENERATE OTP
      // =====================================================

      const otp =
        this.otpService.generateOtp();

      console.log(
        '✅ STEP 3 => OTP GENERATED',
      );

      console.log(
        'OTP =>',
        otp,
      );

      // =====================================================
      // ✅ SAVE OTP
      // =====================================================

      await this.otpService.saveOtp(
        phone,
        otp,
        300,
      );

      console.log(
        '✅ STEP 4 => OTP SAVED IN REDIS',
      );

      // =====================================================
      // ✅ SEND SMS
      // =====================================================

      console.log(
        '✅ STEP 5 => SENDING SMS...',
      );

      const smsResponse =
        await this.otpService.sendOtp(
          phone,
          otp,
          'registration',
        );

      console.log(
        '✅ STEP 6 => SMS RESPONSE',
      );

      console.log(
        smsResponse,
      );

      console.log(
        '🔥 REGISTRATION OTP SENT:',
        otp,
      );

      return {
        success: true,

        message:
          'Registration OTP sent successfully',
      };
    } catch (error) {
      console.log(
        '❌ START REGISTRATION ERROR',
      );

      console.log(error);

      throw error;
    }
  }
}