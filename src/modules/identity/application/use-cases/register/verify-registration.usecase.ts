import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { OtpService } from '@infra/sms/services/otp.service';

import { CreateUserUseCase } from '@modules/identity/application/use-cases/register/create-user.usecase';

import { CreateProfileUseCase } from '@modules/profiles/application/use-cases/create-profile.usecase';

import { CreateWalletUseCase } from '@modules/wallets/application/use-cases/create-wallet.usecase';

import { UserRepository } from '@modules/identity/domain/repositories/user.repository';

import { Inject } from '@nestjs/common';
import { UserCreatorService } from '../../services/user-creator.service';

@Injectable()
export class VerifyRegistrationUseCase {
  constructor(
    private readonly otpService: OtpService,

    private readonly userCreatorService: UserCreatorService,

    private readonly createUser:
      CreateUserUseCase,

    private readonly createProfile:
      CreateProfileUseCase,

    private readonly createWallet:
      CreateWalletUseCase,

    @Inject('UserRepository')
    private readonly userRepository:
      UserRepository,
  ) {}

  async execute(
    phone: string,

    otp: string,

    country: string,

    source: string,
  ) {
    // ✅ verify OTP
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

    // ✅ remove OTP
    await this.otpService.deleteOtp(
      phone,
    );

    // ✅ check existing user
    const existingUser =
      await this.userRepository.findByPhone(
        phone,
      );

    if (existingUser) {
      throw new ConflictException(
        'User already exists',
      );
    }

    // ✅ create user
    const user =
      await this.createUser.execute(
        phone,
        country,
        source,
      );

    // ✅ create profile
    await this.createProfile.execute(
      user.id,
    );

    // ✅ create wallet
    await this.createWallet.execute(
      user.id,
    );

    return {
      message:
        'Registration completed successfully',

      user: {
        id: user.id,

        phone: user.phone,

        country:
          user.country,

        source:
          user.source,
      },
    };
  }
}