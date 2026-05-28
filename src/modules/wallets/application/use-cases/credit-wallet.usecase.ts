import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class CreditWalletUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(data: {
    walletId: string;

    amount: number;

    note?: string;
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

    const referenceId =
      randomUUID();

    await this.walletRepo.createTransaction(
      {
        referenceId,

        receiverWalletId:
          data.walletId,

        amount: data.amount,

        type: 'CREDIT',

        status: 'SUCCESS',

        note: data.note,
      },
    );

    await this.walletRepo.incrementBalance(
      data.walletId,

      data.amount,
    );

    return {
      success: true,

      referenceId,
    };
  }
}