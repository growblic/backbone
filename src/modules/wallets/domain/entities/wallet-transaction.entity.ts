export class WalletTransaction {
  id!: string;

  referenceId!: string;

  senderWalletId?: string;

  receiverWalletId?: string;

  amount!: number;

  type!: string;

  status!: string;

  note?: string;

  createdAt!: Date;

  updatedAt!: Date;
}