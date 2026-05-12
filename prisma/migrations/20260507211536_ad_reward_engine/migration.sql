-- CreateEnum
CREATE TYPE "AdRewardStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "AdRewardCampaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rewardAmount" INTEGER NOT NULL,
    "dailyLimit" INTEGER NOT NULL DEFAULT 10,
    "totalLimit" INTEGER,
    "adsProvider" TEXT NOT NULL,
    "placementId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdRewardCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdRewardClaim" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "rewardAmount" INTEGER NOT NULL,
    "status" "AdRewardStatus" NOT NULL DEFAULT 'SUCCESS',
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,

    CONSTRAINT "AdRewardClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdRewardCampaign_isActive_idx" ON "AdRewardCampaign"("isActive");

-- CreateIndex
CREATE INDEX "AdRewardClaim_userId_idx" ON "AdRewardClaim"("userId");

-- CreateIndex
CREATE INDEX "AdRewardClaim_campaignId_idx" ON "AdRewardClaim"("campaignId");

-- CreateIndex
CREATE INDEX "AdRewardClaim_claimedAt_idx" ON "AdRewardClaim"("claimedAt");

-- AddForeignKey
ALTER TABLE "AdRewardClaim" ADD CONSTRAINT "AdRewardClaim_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AdRewardCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdRewardClaim" ADD CONSTRAINT "AdRewardClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
