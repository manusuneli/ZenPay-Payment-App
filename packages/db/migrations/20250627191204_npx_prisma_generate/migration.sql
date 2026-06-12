/*
  Warnings:

  - Changed the type of `status` on the `SplitEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SplitEntry" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;
