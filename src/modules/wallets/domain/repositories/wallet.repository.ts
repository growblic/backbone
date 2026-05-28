export abstract class WalletRepository {
  abstract create(data: {
    userId: string;

    walletNumber: string;

    walletHandle: string;
  }): Promise<any>;

  abstract findById(
    walletId: string,
  ): Promise<any>;

  abstract findByUserId(
    userId: string,
  ): Promise<any>;

  abstract findByWalletHandle(
    walletHandle: string,
  ): Promise<any>;

  abstract updateBalance(
    walletId: string,

    availableBalance: number,
  ): Promise<any>;

  abstract incrementBalance(
    walletId: string,

    amount: number,
  ): Promise<any>;

  abstract decrementBalance(
    walletId: string,

    amount: number,
  ): Promise<any>;

  abstract lockBalance(
    walletId: string,

    amount: number,
  ): Promise<any>;

  abstract unlockBalance(
    walletId: string,

    amount: number,
  ): Promise<any>;

  abstract createTransaction(data: {
    referenceId: string;

    senderWalletId?: string;

    receiverWalletId?: string;

    amount: number;

    type: string;

    status: string;

    note?: string;

    idempotencyKey?: string;
  }): Promise<any>;

  abstract findTransactionByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<any>;

  abstract transfer(data: {
    senderWalletId: string;

    receiverWalletId: string;

    amount: number;

    idempotencyKey: string;

    note?: string;
  }): Promise<any>;

  abstract findTransactions(
    walletId: string,
  ): Promise<any[]>;

  abstract createWithdrawal(data: {
    walletId: string;

    amount: number;

    bankName?: string;

    accountNumber?: string;

    ifscCode?: string;

    upiId?: string;
  }): Promise<any>;

  abstract findWithdrawalById(
    withdrawalId: string,
  ): Promise<any>;

  abstract getPendingWithdrawals(): Promise<any[]>;

  abstract approveWithdrawal(
    withdrawalId: string,
  ): Promise<any>;

  abstract rejectWithdrawal(
    withdrawalId: string,

    adminRemark?: string,
  ): Promise<any>;

  abstract credit(data: {
  userId: string;

  amount: number;

  currency: string;

  reason: string;

  referenceId?: string;
}): Promise<any>;

  abstract getTodayTransferTotal(
  walletId: string,
): Promise<number>;

abstract getTodayWithdrawalTotal(
  walletId: string,
): Promise<number>;
}