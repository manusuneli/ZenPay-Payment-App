/*
  Warnings:

  - The `status` column on the `SplitEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_splitId_fkey";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "SplitBill_createdByUserId_idx";

-- DropIndex
DROP INDEX "SplitEntry_splitBillId_idx";

-- DropIndex
DROP INDEX "SplitEntry_token_tokenExpiresAt_idx";

-- DropIndex
DROP INDEX "SplitEntry_userId_idx";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "splitId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SplitEntry" DROP COLUMN "status",
ADD COLUMN     "status" "SplitStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "SplitEntry" ADD CONSTRAINT "SplitEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "SplitEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
