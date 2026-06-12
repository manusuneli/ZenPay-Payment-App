-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_splitId_fkey";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "splitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "SplitEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
