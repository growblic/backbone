import { WalletTransaction } from '../entities/wallet-transaction.entity';

export interface WalletTransactionRepository {
  save(transaction: WalletTransaction): Promise<void>;

  findByWallet(walletId: string): Promise<WalletTransaction[]>;
}