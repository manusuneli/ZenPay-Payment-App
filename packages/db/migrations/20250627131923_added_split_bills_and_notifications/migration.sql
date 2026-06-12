-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('split', 'payment', 'transfer');

-- CreateEnum
CREATE TYPE "NotificationAction" AS ENUM ('approve', 'pay', 'view');

-- CreateEnum
CREATE TYPE "SplitStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "SplitBill" (
    "id" SERIAL NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "SplitBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "status" "SplitStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "splitBillId" INTEGER NOT NULL,

    CONSTRAINT "SplitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "action" "NotificationAction" NOT NULL,
    "message" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "splitId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SplitBill_createdByUserId_idx" ON "SplitBill"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitEntry_token_key" ON "SplitEntry"("token");

-- CreateIndex
CREATE INDEX "SplitEntry_splitBillId_idx" ON "SplitEntry"("splitBillId");

-- CreateIndex
CREATE INDEX "SplitEntry_userId_idx" ON "SplitEntry"("userId");

-- CreateIndex
CREATE INDEX "SplitEntry_token_tokenExpiresAt_idx" ON "SplitEntry"("token", "tokenExpiresAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- AddForeignKey
ALTER TABLE "SplitBill" ADD CONSTRAINT "SplitBill_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitEntry" ADD CONSTRAINT "SplitEntry_splitBillId_fkey" FOREIGN KEY ("splitBillId") REFERENCES "SplitBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "SplitEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
