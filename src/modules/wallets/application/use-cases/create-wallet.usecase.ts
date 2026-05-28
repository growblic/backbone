import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class CreateWalletUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(
    userId: string,
  ) {
    const existing =
      await this.walletRepo.findByUserId(
        userId,
      );

    if (existing) {
      return existing;
    }

    const walletNumber = `GB${Date.now()}`;

    const walletHandle = `user_${Date.now()}`;

    const wallet =
      await this.walletRepo.create({
        userId,

        walletNumber,

        walletHandle,
      });

    return wallet;
  }
}