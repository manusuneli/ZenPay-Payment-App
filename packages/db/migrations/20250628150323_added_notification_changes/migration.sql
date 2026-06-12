/*
  Warnings:

  - You are about to drop the column `seenAt` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `splitId` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `token` on table `SplitEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_splitId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "seenAt",
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "splitId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SplitEntry" ALTER COLUMN "token" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "SplitEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
