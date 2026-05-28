import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class GetMyWalletUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(userId: string) {
    const wallet =
      await this.walletRepo.findByUserId(
        userId,
      );

    if (!wallet) {
      throw new NotFoundException(
        'Wallet not found',
      );
    }

    return wallet;
  }
}