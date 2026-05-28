import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class TransferWalletUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(data: {
    senderWalletId: string;

    receiverWalletHandle: string;

    amount: number;

    idempotencyKey: string;

    note?: string;
  }) {
    // FIND SENDER
    const senderWallet =
      await this.walletRepo.findById(
        data.senderWalletId,
      );

    if (!senderWallet) {
      throw new NotFoundException(
        'Sender wallet not found',
      );
    }

    // FIND RECEIVER
    const receiverWallet =
      await this.walletRepo.findByWalletHandle(
        data.receiverWalletHandle,
      );

    if (!receiverWallet) {
      throw new NotFoundException(
        'Receiver wallet not found',
      );
    }

    // SELF TRANSFER BLOCK
    if (
      senderWallet.id ===
      receiverWallet.id
    ) {
      throw new BadRequestException(
        'Cannot transfer to self',
      );
    }

    // BALANCE CHECK
    if (
      senderWallet.availableBalance <
      data.amount
    ) {
      throw new BadRequestException(
        'Insufficient balance',
      );
    }

    // CHECK DUPLICATE TRANSACTION
    const existingTransaction =
      await this.walletRepo.findTransactionByIdempotencyKey(
        data.idempotencyKey,
      );

    if (existingTransaction) {
      return {
        success: true,

        duplicate: true,

        transactionId:
          existingTransaction.id,

        referenceId:
          existingTransaction.referenceId,

        amount:
          existingTransaction.amount,

        status:
          existingTransaction.status,
      };
    }

    // SAFE TRANSFER
    const transaction =
      await this.walletRepo.transfer({
        senderWalletId:
          senderWallet.id,

        receiverWalletId:
          receiverWallet.id,

        amount: data.amount,

        idempotencyKey:
          data.idempotencyKey,

        note: data.note,
      });

    return {
      success: true,

      duplicate: false,

      transactionId:
        transaction.id,

      referenceId:
        transaction.referenceId,

      amount: transaction.amount,

      status: transaction.status,
    };
  }
}