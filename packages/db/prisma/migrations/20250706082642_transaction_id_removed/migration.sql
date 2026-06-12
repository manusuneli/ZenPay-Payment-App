/*
  Warnings:

  - You are about to drop the column `transactionId` on the `OnRampTransaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "OnRampTransaction_transactionId_key";

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "transactionId";
