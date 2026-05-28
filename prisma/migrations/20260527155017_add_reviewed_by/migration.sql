/*
  Warnings:

  - You are about to drop the column `reviewedby` on the `TaskSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TaskSubmission" DROP COLUMN "reviewedby",
ADD COLUMN     "reviewedBy" TEXT;
