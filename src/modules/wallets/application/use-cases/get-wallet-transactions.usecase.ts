import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class GetWalletTransactionsUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(
    walletId: string,
  ) {
    return this.walletRepo.findTransactions(
      walletId,
    );
  }
}