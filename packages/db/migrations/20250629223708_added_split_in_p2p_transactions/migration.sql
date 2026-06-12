-- CreateEnum
CREATE TYPE "p2pTransferType" AS ENUM ('SPLIT', 'P2P');

-- AlterTable
ALTER TABLE "p2pTransfer" ADD COLUMN     "type" "p2pTransferType" DEFAULT 'P2P';
