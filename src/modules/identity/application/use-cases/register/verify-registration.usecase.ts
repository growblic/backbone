import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { OtpService } from '@modules/identity/application/services/otp.service';

import { CreateUserUseCase } from '@modules/identity/application/use-cases/register/create-user.usecase';

import { CreateProfileUseCase } from '@modules/profiles/application/use-cases/create-profile.usecase';

import { CreateWalletUseCase } from '@modules/wallets/application/use-cases/create-wallet.usecase';

@Injectable()
export class VerifyRegistrationUseCase {
  constructor(
    private readonly otpService: OtpService,

    private readonly createUser:
      CreateUserUseCase,

    private readonly createProfile:
      CreateProfileUseCase,

    private readonly createWallet:
      CreateWalletUseCase,
  ) {}

  async execute(
    phone: string,

    otp: string,

    country: string,

    source: string,
  ) {
    // VERIFY OTP
    const isValid =
      await this.otpService.verifyOtp(
        phone,
        otp,
      );

    if (!isValid) {
      throw new UnauthorizedException(
        'Invalid or expired OTP',
      );
    }

    // DELETE OTP
    await this.otpService.deleteOtp(
      phone,
    );

    // CREATE USER
    const user =
      await this.createUser.execute(
        phone,
        country,
        source,
      );

    // CREATE PROFILE
    await this.createProfile.execute(
      user.id,
    );

    // CREATE WALLET
    await this.createWallet.execute(
      user.id,
    );

    console.log(
      'REGISTRATION COMPLETE 🎉',
      user.id,
    );

    return user;
  }
}