import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class DebitWalletUseCase {
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

    if (
      wallet.availableBalance <
      data.amount
    ) {
      throw new BadRequestException(
        'Insufficient balance',
      );
    }

    const referenceId =
      randomUUID();

    await this.walletRepo.createTransaction(
      {
        referenceId,

        senderWalletId:
          data.walletId,

        amount: data.amount,

        type: 'DEBIT',

        status: 'SUCCESS',

        note: data.note,
      },
    );

    await this.walletRepo.decrementBalance(
      data.walletId,

      data.amount,
    );

    return {
      success: true,

      referenceId,
    };
  }
}