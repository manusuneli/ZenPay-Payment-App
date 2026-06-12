/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OnRampTransaction" ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_transactionId_key" ON "OnRampTransaction"("transactionId");
