import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class RejectWithdrawalUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  async execute(
    withdrawalId: string,

    adminRemark?: string,
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

    // REJECT
    return this.walletRepo.rejectWithdrawal(
      withdrawal.id,

      adminRemark,
    );
  }
}