/*
  Warnings:

  - The values [CREDIT,DEBIT] on the enum `WalletTransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `balance` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `walletId` on the `WalletTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletNumber]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletHandle]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `walletHandle` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletNumber` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `referenceId` on table `WalletTransaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "WalletTransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('CREDIT', 'DEBIT');

-- AlterEnum
BEGIN;
CREATE TYPE "WalletTransactionType_new" AS ENUM ('TRANSFER', 'REWARD', 'WITHDRAW', 'RECHARGE', 'TASK_REWARD', 'AD_REWARD');
ALTER TABLE "WalletTransaction" ALTER COLUMN "type" TYPE "WalletTransactionType_new" USING ("type"::text::"WalletTransactionType_new");
ALTER TYPE "WalletTransactionType" RENAME TO "WalletTransactionType_old";
ALTER TYPE "WalletTransactionType_new" RENAME TO "WalletTransactionType";
DROP TYPE "public"."WalletTransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_walletId_fkey";

-- DropIndex
DROP INDEX "WalletTransaction_walletId_idx";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "balance",
ADD COLUMN     "availableBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "WalletStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "walletHandle" TEXT NOT NULL,
ADD COLUMN     "walletNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WalletTransaction" DROP COLUMN "walletId",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "receiverWalletId" TEXT,
ADD COLUMN     "senderWalletId" TEXT,
ADD COLUMN     "status" "WalletTransactionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "referenceId" SET NOT NULL;

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "type" "LedgerEntryType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerEntry_walletId_idx" ON "LedgerEntry"("walletId");

-- CreateIndex
CREATE INDEX "LedgerEntry_transactionId_idx" ON "LedgerEntry"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_walletNumber_key" ON "Wallet"("walletNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_walletHandle_key" ON "Wallet"("walletHandle");

-- CreateIndex
CREATE INDEX "Wallet_walletHandle_idx" ON "Wallet"("walletHandle");

-- CreateIndex
CREATE INDEX "Wallet_walletNumber_idx" ON "Wallet"("walletNumber");

-- CreateIndex
CREATE INDEX "WalletTransaction_senderWalletId_idx" ON "WalletTransaction"("senderWalletId");

-- CreateIndex
CREATE INDEX "WalletTransaction_receiverWalletId_idx" ON "WalletTransaction"("receiverWalletId");

-- CreateIndex
CREATE INDEX "WalletTransaction_referenceId_idx" ON "WalletTransaction"("referenceId");

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_senderWalletId_fkey" FOREIGN KEY ("senderWalletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_receiverWalletId_fkey" FOREIGN KEY ("receiverWalletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "WalletTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
