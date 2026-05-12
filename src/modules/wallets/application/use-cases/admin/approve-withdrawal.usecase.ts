import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class ApproveWithdrawalUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(
    withdrawalId: string,
  ) {
    const withdrawal =
      await this.walletRepo.findWithdrawalById(
        withdrawalId,
      );

    if (!withdrawal) {
      throw new NotFoundException(
        'Withdrawal not found',
      );
    }

    if (
      withdrawal.status !==
      'PENDING'
    ) {
      throw new BadRequestException(
        'Withdrawal already processed',
      );
    }

    // REMOVE LOCKED BALANCE
    await this.walletRepo.decrementBalance(
      withdrawal.walletId,

      withdrawal.amount,
    );

    // APPROVE
    return this.walletRepo.approveWithdrawal(
      withdrawal.id,
    );
  }
}