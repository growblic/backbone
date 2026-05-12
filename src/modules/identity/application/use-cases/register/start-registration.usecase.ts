import { Injectable } from '@nestjs/common';
import { OtpService } from '@modules/identity/application/services/otp.service';

@Injectable()
export class StartRegistrationUseCase {
  constructor(
    private readonly otpService: OtpService,
  ) {}

  async execute(phone: string): Promise<void> {
    // ✅ OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ save OTP (5 min)
    await this.otpService.saveOtp(phone, otp, 300);

    // ✅ log (later SMS service लगेगा)
    console.log('REGISTRATION OTP SENT 🔐:', otp);
  }
}