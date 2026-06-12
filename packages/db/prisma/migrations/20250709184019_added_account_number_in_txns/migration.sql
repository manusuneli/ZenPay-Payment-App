-- AlterTable
ALTER TABLE "OffRampTransaction" ADD COLUMN     "accountNumber" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "OnRampTransaction" ADD COLUMN     "accountNumber" TEXT NOT NULL DEFAULT '';
