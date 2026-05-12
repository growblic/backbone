import { Injectable } from '@nestjs/common';
import { OtpService } from '@modules/identity/application/services/otp.service';
import { RateLimitService } from '@identity/application/services/rate-limit.service';

@Injectable()
export class StartLoginUseCase {
  constructor(
    private readonly otpService: OtpService,
    private readonly rateLimitService:RateLimitService,
  ) {}

  async execute(phone: string) {
    await this.rateLimitService.checkOtpLimit(phone);
    // 🔢 OTP generate
    const otp = this.otpService.generateOtp();

    // ⏳ save with TTL (5 min)
    await this.otpService.saveOtp(phone, otp, 300);

    console.log('LOGIN OTP:', otp);

    return {
      message: 'OTP sent successfully',
    };
  }
}