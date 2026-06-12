/*
  Warnings:

  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessToken]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_accessToken_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accessToken" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken";

-- CreateIndex
CREATE UNIQUE INDEX "Account_accessToken_key" ON "Account"("accessToken");
