import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { PrismaService } from '@infra/prisma/prisma.service';
import { WalletTransactionType } from '@prisma/client';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class WalletPrismaRepository
  implements WalletRepository
{
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async create(data: {
    userId: string;

    walletNumber: string;

    walletHandle: string;
  }) {
    return this.prisma.wallet.create({
      data: {
        userId: data.userId,

        walletNumber:
          data.walletNumber,

        walletHandle:
          data.walletHandle,

        availableBalance: 0,
        lockedBalance: 0,
      },
    });
  }

  async findById(
    walletId: string,
  ) {
    return this.prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
  }

  async findByUserId(
    userId: string,
  ) {
    return this.prisma.wallet.findUnique(
      {
        where: { userId },
      },
    );
  }

  async findByWalletNumber(
    walletNumber: string,
  ) {
    return this.prisma.wallet.findUnique(
      {
        where: { walletNumber },
      },
    );
  }

  async findByWalletHandle(
    walletHandle: string,
  ) {
    return this.prisma.wallet.findUnique(
      {
        where: { walletHandle },
      },
    );
  }

  async updateBalance(
    walletId: string,

    availableBalance: number,
  ) {
    return this.prisma.wallet.update({
      where: {
        id: walletId,
      },

      data: {
        availableBalance,
      },
    });
  }

  async incrementBalance(
    walletId: string,

    amount: number,
  ) {
    return this.prisma.wallet.update({
      where: {
        id: walletId,
      },

      data: {
        availableBalance: {
          increment: amount,
        },
      },
    });
  }

  async decrementBalance(
    walletId: string,

    amount: number,
  ) {
    return this.prisma.wallet.update({
      where: {
        id: walletId,
      },

      data: {
        availableBalance: {
          decrement: amount,
        },
      },
    });
  }

  async createTransaction(data: {
    referenceId: string;

    senderWalletId?: string;

    receiverWalletId?: string;

    amount: number;

    type: string;

    status: string;

    note?: string;

    idempotencyKey?: string;
  }) {
    return this.prisma.walletTransaction.create(
      {
        data: {
          referenceId:
            data.referenceId,

          idempotencyKey:
            data.idempotencyKey,

          senderWalletId:
            data.senderWalletId,

          receiverWalletId:
            data.receiverWalletId,

          amount: data.amount,

          type: data.type as any,

          status:
            data.status as any,

          note: data.note,
        },
      },
    );
  }

  async findTransactionByIdempotencyKey(
    idempotencyKey: string,
  ) {
    return this.prisma.walletTransaction.findUnique(
      {
        where: {
          idempotencyKey,
        },
      },
    );
  }

  async transfer(data: {
    senderWalletId: string;

    receiverWalletId: string;

    amount: number;

    idempotencyKey: string;

    note?: string;
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        const existingTransaction =
          await tx.walletTransaction.findUnique(
            {
              where: {
                idempotencyKey:
                  data.idempotencyKey,
              },
            },
          );

        if (existingTransaction) {
          return existingTransaction;
        }

        const sender =
          await tx.wallet.findUnique({
            where: {
              id: data.senderWalletId,
            },
          });

        if (!sender) {
          throw new Error(
            'Sender wallet not found',
          );
        }

        const receiver =
          await tx.wallet.findUnique({
            where: {
              id: data.receiverWalletId,
            },
          });

        if (!receiver) {
          throw new Error(
            'Receiver wallet not found',
          );
        }

        if (
          sender.availableBalance.toNumber()
          < data.amount
        ) {
          throw new Error(
            'Insufficient balance',
          );
        }

        const transaction =
          await tx.walletTransaction.create(
            {
              data: {
                referenceId:
                  randomUUID(),

                idempotencyKey:
                  data.idempotencyKey,

                senderWalletId:
                  sender.id,

                receiverWalletId:
                  receiver.id,

                amount: data.amount,

                type: 'TRANSFER',

                status: 'PENDING',

                note: data.note,
              },
            },
          );

        await tx.walletTransaction.update({
          where: {
            id: transaction.id,
          },

          data: {
            status: 'PROCESSING' as any,
          },
        });

        const updatedSender =
          await tx.wallet.update({
            where: {
              id: sender.id,
            },

            data: {
              availableBalance: {
                decrement:
                  data.amount,
              },
            },
          });

        const updatedReceiver =
          await tx.wallet.update({
            where: {
              id: receiver.id,
            },

            data: {
              availableBalance: {
                increment:
                  data.amount,
              },
            },
          });

        await tx.ledgerEntry.create({
          data: {
            walletId: sender.id,

            transactionId:
              transaction.id,

            type: 'DEBIT',

            amount: data.amount,

            balanceAfter:
              updatedSender.availableBalance,
          },
        });

        await tx.ledgerEntry.create({
          data: {
            walletId: receiver.id,

            transactionId:
              transaction.id,

            type: 'CREDIT',

            amount: data.amount,

            balanceAfter:
              updatedReceiver.availableBalance,
          },
        });

        const completedTransaction =
          await tx.walletTransaction.update({
            where: {
              id: transaction.id,
            },

            data: {
              status: 'SUCCESS',
            },
          });

        return completedTransaction;
      },
    );
  }

  async findTransactions(
    walletId: string,
  ) {
    return this.prisma.walletTransaction.findMany(
      {
        where: {
          OR: [
            {
              senderWalletId:
                walletId,
            },

            {
              receiverWalletId:
                walletId,
            },
          ],
        },

        orderBy: {
          createdAt: 'desc',
        },
      },
    );
  }

  async credit(data: {
  userId: string;

  amount: number;

  currency: string;

  reason: string;

  referenceId?: string;
}) {
  return this.prisma.wallet.update({
    where: {
      userId: data.userId,
    },

    data: {
      availableBalance: {
        increment: data.amount,
        
      },
    },
  });
}

  async findWithdrawalById(
    withdrawalId: string,
  ) {
    return this.prisma.withdrawal.findUnique(
      {
        where: {
          id: withdrawalId,
        },
      },
    );
  }

  async getPendingWithdrawals() {
    return this.prisma.withdrawal.findMany(
      {
        where: {
          status: 'PENDING',
        },

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          wallet: true,
        },
      },
    );
  }

  async approveWithdrawal(
    withdrawalId: string,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const withdrawal =
          await tx.withdrawal.findUnique(
            {
              where: {
                id: withdrawalId,
              },
            },
          );

        if (!withdrawal) {
          throw new Error(
            'Withdrawal not found',
          );
        }

        if (
          withdrawal.status !==
          'PENDING'
        ) {
          throw new Error(
            'Withdrawal already processed',
          );
        }

        const wallet =
          await tx.wallet.findUnique({
            where: {
              id: withdrawal.walletId,
            },
          });

        if (!wallet) {
          throw new Error(
            'Wallet not found',
          );
        }

        await tx.wallet.update({
          where: {
            id: wallet.id,
          },

          data: {
            lockedBalance: {
              decrement:
                withdrawal.amount,
            },
          },
        });

        const transaction =
          await tx.walletTransaction.create(
            {
              data: {
                referenceId:
                  randomUUID(),

                senderWalletId:
                  wallet.id,

                amount:
                  withdrawal.amount,

                type: 'WITHDRAW',

                status: 'SUCCESS',

                note:
                  'Withdrawal approved',
              },
            },
          );

        await tx.ledgerEntry.create({
          data: {
            walletId: wallet.id,

            transactionId:
              transaction.id,

            type: 'DEBIT',

            amount:
              withdrawal.amount,

            balanceAfter:
              wallet.availableBalance,
          },
        });

        return tx.withdrawal.update({
          where: {
            id: withdrawal.id,
          },

          data: {
            status: 'APPROVED',

            processedAt:
              new Date(),
          },
        });
      },
    );
  }

  async rejectWithdrawal(
    withdrawalId: string,

    adminRemark?: string,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const withdrawal =
          await tx.withdrawal.findUnique(
            {
              where: {
                id: withdrawalId,
              },
            },
          );

        if (!withdrawal) {
          throw new Error(
            'Withdrawal not found',
          );
        }

        if (
          withdrawal.status !==
          'PENDING'
        ) {
          throw new Error(
            'Withdrawal already processed',
          );
        }

        const wallet =
          await tx.wallet.findUnique({
            where: {
              id: withdrawal.walletId,
            },
          });

        if (!wallet) {
          throw new Error(
            'Wallet not found',
          );
        }

        const updated =
          await tx.wallet.updateMany({
            where: {
              id: wallet.id,

              lockedBalance: {
                gte:
                  withdrawal.amount,
              },
            },

            data: {
              lockedBalance: {
                decrement:
                  withdrawal.amount,
              },

              availableBalance: {
                increment:
                  withdrawal.amount,
              },
            },
          });

        if (updated.count === 0) {
          throw new Error(
            'Invalid locked balance',
          );
        }

        const updatedWallet =
          await tx.wallet.findUnique({
            where: {
              id: wallet.id,
            },
          });

        const transaction =
          await tx.walletTransaction.create(
            {
              data: {
                referenceId:
                  randomUUID(),

                receiverWalletId:
                  wallet.id,

                amount:
                  withdrawal.amount,

                type: 'WITHDRAW',

                status: 'REVERSED',

                note:
                  'Withdrawal rejected refund',
              },
            },
          );

        await tx.ledgerEntry.create({
          data: {
            walletId: wallet.id,

            transactionId:
              transaction.id,

            type: 'CREDIT',

            amount:
              withdrawal.amount,

            balanceAfter:
              updatedWallet?.availableBalance ||
              0,
          },
        });

        return tx.withdrawal.update({
          where: {
            id: withdrawal.id,
          },

          data: {
            status: 'REJECTED',

            adminRemark,

            processedAt:
              new Date(),
          },
        });
      },
    );
  }

  async lockBalance(
    walletId: string,

    amount: number,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const updated =
          await tx.wallet.updateMany({
            where: {
              id: walletId,

              availableBalance: {
                gte: amount,
              },
            },

            data: {
              availableBalance: {
                decrement: amount,
              },

              lockedBalance: {
                increment: amount,
              },
            },
          });

        if (updated.count === 0) {
          throw new Error(
            'Insufficient balance',
          );
        }

        return tx.wallet.findUnique({
          where: {
            id: walletId,
          },
        });
      },
    );
  }

  async unlockBalance(
    walletId: string,

    amount: number,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const updated =
          await tx.wallet.updateMany({
            where: {
              id: walletId,

              lockedBalance: {
                gte: amount,
              },
            },

            data: {
              lockedBalance: {
                decrement: amount,
              },

              availableBalance: {
                increment: amount,
              },
            },
          });

        if (updated.count === 0) {
          throw new Error(
            'Invalid locked balance',
          );
        }

        return tx.wallet.findUnique({
          where: {
            id: walletId,
          },
        });
      },
    );
  }

  async createWithdrawal(data: {
    walletId: string;

    amount: number;

    bankName?: string;

    accountNumber?: string;

    ifscCode?: string;

    upiId?: string;
  }) {
    return this.prisma.withdrawal.create({
      data: {
        walletId: data.walletId,

        amount: data.amount,

        bankName: data.bankName,

        accountNumber:
          data.accountNumber,

        ifscCode:
          data.ifscCode,

        upiId: data.upiId,
      },
    });
  }

  async getTodayTransferTotal(
    walletId: string,
  ) {
    const startOfDay =
      new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0,
    );

    const result =
      await this.prisma.walletTransaction.aggregate(
        {
          _sum: {
            amount: true,
          },

          where: {
            senderWalletId:
              walletId,

            type: 'TRANSFER',

            status:
              'SUCCESS',

            createdAt: {
              gte: startOfDay,
            },
          },
        },
      );

    return (
      result._sum.amount?.toNumber() || 0
    );
  }

  async getTodayWithdrawalTotal(
    walletId: string,
  ) {
    const startOfDay =
      new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0,
    );

    const result =
      await this.prisma.withdrawal.aggregate(
        {
          _sum: {
            amount: true,
          },

          where: {
            walletId,

            status:
              'APPROVED',

            createdAt: {
              gte: startOfDay,
            },
          },
        },
      );

    return (
      result._sum.amount?.toNumber() || 0
    );
  }
}