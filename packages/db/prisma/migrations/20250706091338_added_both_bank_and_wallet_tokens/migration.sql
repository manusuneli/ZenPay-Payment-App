/*
  Warnings:

  - You are about to drop the column `token` on the `OnRampTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletToken]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bankToken]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `walletToken` to the `OnRampTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OnRampTransaction_token_key";

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "token",
ADD COLUMN     "bankToken" TEXT,
ADD COLUMN     "walletToken" TEXT NOT NULL,
ALTER COLUMN "startTime" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_walletToken_key" ON "OnRampTransaction"("walletToken");

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_bankToken_key" ON "OnRampTransaction"("bankToken");
