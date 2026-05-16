import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

import { ApproveWithdrawalUseCase } from '@modules/wallets/application/use-cases/admin/approve-withdrawal.usecase';

import { RejectWithdrawalUseCase } from '@modules/wallets/application/use-cases/admin/reject-withdrawal.usecase';
 
@Controller('admin/wallets')
@UseGuards(JwtAuthGuard)
export class AdminWalletController {
  constructor(
    private readonly approveWithdrawal:
      ApproveWithdrawalUseCase,

    private readonly rejectWithdrawal:
      RejectWithdrawalUseCase,

    @Inject('WalletRepository')
    private readonly walletRepo: WalletRepository,
  ) {}

  @Get('withdrawals')
  async getWithdrawals() {
    return this.walletRepo.getPendingWithdrawals();
  }

  @Patch(
    'withdrawals/:id/approve',
  )
  async approve(
    @Param('id') id: string,
  ) {
    return this.approveWithdrawal.execute(
      id,
    );
  }

  @Patch(
    'withdrawals/:id/reject',
  )
  async reject(
    @Param('id') id: string,

    @Body()
    body: {
      adminRemark?: string;
    },
  ) {
    return this.rejectWithdrawal.execute(
      id,

      body.adminRemark,
    );
  }
}