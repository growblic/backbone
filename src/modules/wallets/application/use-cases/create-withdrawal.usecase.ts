import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class CreateWithdrawalUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(data: {
    walletId: string;

    amount: number;

    bankName?: string;

    accountNumber?: string;

    ifscCode?: string;

    upiId?: string;
  }) {
    const wallet =
      await this.walletRepo.findById(
        data.walletId,
      );

    if (!wallet) {
      throw new NotFoundException(
        'Wallet not found',
      );
    }

    if (
      wallet.availableBalance <
      data.amount
    ) {
      throw new BadRequestException(
        'Insufficient balance',
      );
    }

    // LOCK BALANCE
    await this.walletRepo.lockBalance(
      wallet.id,
      data.amount,
    );

    // CREATE WITHDRAWAL
    const withdrawal =
      await this.walletRepo.createWithdrawal(
        {
          walletId: wallet.id,

          amount: data.amount,

          bankName: data.bankName,

          accountNumber:
            data.accountNumber,

          ifscCode: data.ifscCode,

          upiId: data.upiId,
        },
      );

    return {
      success: true,

      withdrawalId:
        withdrawal.id,

      status:
        withdrawal.status,
    };
  }
}