/*
  Warnings:

  - Added the required column `paymentModeP2P` to the `p2pTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentTypeP2P" AS ENUM ('received', 'paid');

-- AlterTable
ALTER TABLE "p2pTransfer" ADD COLUMN     "paymentModeP2P" "PaymentTypeP2P" NOT NULL;
