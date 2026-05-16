import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';

import { GetMyWalletUseCase } from '@modules/wallets/application/use-cases/get-my-wallet.usecase';

import { TransferWalletUseCase } from '@modules/wallets/application/use-cases/transfer-wallet.usecase';

import { CreateWithdrawalDto } from '@modules/wallets/presentation/dto/create-withdrawal.dto';

import { CreateWithdrawalUseCase } from '@modules/wallets/application/use-cases/create-withdrawal.usecase';

import { TransferWalletDto } from '@modules/wallets/presentation/dto/transfer-wallet.dto';
import { GetWalletTransactionsUseCase } from '@modules/wallets/application/use-cases/get-wallet-transactions.usecase';

@Controller('me/wallet')
export class WalletController {
  constructor(
    private readonly getMyWallet:
      GetMyWalletUseCase,

      private readonly createWithdrawal:
      CreateWithdrawalUseCase,

    private readonly transferWallet:
      TransferWalletUseCase,

    private readonly getWalletTransactions:
      GetWalletTransactionsUseCase,
  ) {}


  // CREATE WITHDRAWAL
  @UseGuards(JwtAuthGuard)
  @Post('/withdraw')
  async createWithdraw(
    @Req() req: any,

    @Body()
    body: CreateWithdrawalDto,
  ) {
    const wallet =
      await this.getMyWallet.execute(
        req.user.sub,
      );

    return this.createWithdrawal.execute(
      {
        walletId: wallet.id,

        amount: body.amount,

        bankName: body.bankName,

        accountNumber:
          body.accountNumber,

        ifscCode:
          body.ifscCode,

        upiId: body.upiId,
      },
    );
  }

  // GET MY WALLET
  @UseGuards(JwtAuthGuard)
  @Get()
  async getWallet(
    @Req() req: any,
  ) {
    return this.getMyWallet.execute(
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
@Get('transactions')
async transactions(
  @Req() req: any,
) {
  const wallet =
    await this.getMyWallet.execute(
      req.user.sub,
    );

  return this.getWalletTransactions.execute(
    wallet.id,
  );
}

  // TRANSFER MONEY
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transfer(
    @Req() req: any,

    @Body()
    body: TransferWalletDto,
  ) {
    // FIND SENDER WALLET
    const senderWallet =
      await this.getMyWallet.execute(
        req.user.sub,
      );

    return this.transferWallet.execute(
      {
        senderWalletId:
          senderWallet.id,

        receiverWalletHandle:
          body.receiverHandle,

        amount: body.amount,

        idempotencyKey:
        req.headers[
          'idempotency-key'
        ]as string,

        note: body.note,
      },
    );
  }
}