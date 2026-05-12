import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

export class GetWalletUseCase {
  constructor(private readonly walletRepo: WalletRepository) {}

  execute(userId: string) {
    return this.walletRepo.findByUserId(userId);
  }
}