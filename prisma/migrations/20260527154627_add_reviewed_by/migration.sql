/*
  Warnings:

  - The values [SUPER_ADMIN,SUPPORT_ADMIN,FINANCE_ADMIN,KYC_AGENT,MODERATOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The `currency` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `reviewedBy` on the `TaskSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.
  - Changed the type of `source` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'KYC_ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "AppSource" AS ENUM ('FLUTTER_APP', 'ANDROID', 'IOS', 'WEB');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "AdRewardCampaign" ALTER COLUMN "rewardAmount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "AdRewardClaim" ALTER COLUMN "rewardAmount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "LedgerEntry" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "balanceAfter" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "rewardAmount" SET DATA TYPE DECIMAL(18,2),
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';

-- AlterTable
ALTER TABLE "TaskSubmission" DROP COLUMN "reviewedBy",
ADD COLUMN     "reviewedByAdminId" TEXT,
ADD COLUMN     "reviewedby" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "source",
ADD COLUMN     "source" "AppSource" NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "availableBalance" DROP DEFAULT,
ALTER COLUMN "availableBalance" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "lockedBalance" DROP DEFAULT,
ALTER COLUMN "lockedBalance" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "WalletTransaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Withdrawal" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'OPERATIONS_ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceName" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminPermission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminRolePermission" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminRolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_role_idx" ON "AdminUser"("role");

-- CreateIndex
CREATE INDEX "admin_sessions_adminUserId_idx" ON "admin_sessions"("adminUserId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPermission_key_key" ON "AdminPermission"("key");

-- CreateIndex
CREATE INDEX "AdminPermission_key_idx" ON "AdminPermission"("key");

-- CreateIndex
CREATE INDEX "AdminRolePermission_adminUserId_idx" ON "AdminRolePermission"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminRolePermission_permissionId_idx" ON "AdminRolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminRolePermission_adminUserId_permissionId_key" ON "AdminRolePermission"("adminUserId", "permissionId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminUserId_idx" ON "AdminAuditLog"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entity_idx" ON "AdminAuditLog"("entity");

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Kyc_status_idx" ON "Kyc"("status");

-- CreateIndex
CREATE INDEX "Profile_username_idx" ON "Profile"("username");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_slug_idx" ON "Task"("slug");

-- CreateIndex
CREATE INDEX "TaskSubmission_status_idx" ON "TaskSubmission"("status");

-- CreateIndex
CREATE INDEX "TaskSubmission_taskId_idx" ON "TaskSubmission"("taskId");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminRolePermission" ADD CONSTRAINT "AdminRolePermission_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminRolePermission" ADD CONSTRAINT "AdminRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "AdminPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
