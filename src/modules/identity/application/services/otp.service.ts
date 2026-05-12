import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(phone: string, otp: string, ttlSeconds: number) {
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.otpStore.set(phone, {
      otp,
      expiresAt,
    });
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const data = this.otpStore.get(phone);

    if (!data) return false;

    if (Date.now() > data.expiresAt) {
      this.otpStore.delete(phone);
      return false;
    }

    return data.otp === otp;
  }

  async deleteOtp(phone: string) {
    this.otpStore.delete(phone);
  }
}