/*
  Warnings:

  - The values [approve,pay,view] on the enum `NotificationAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [split,payment,transfer] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationAction_new" AS ENUM ('APPROVE', 'PAY', 'VIEW');
ALTER TABLE "Notification" ALTER COLUMN "action" TYPE "NotificationAction_new" USING ("action"::text::"NotificationAction_new");
ALTER TYPE "NotificationAction" RENAME TO "NotificationAction_old";
ALTER TYPE "NotificationAction_new" RENAME TO "NotificationAction";
DROP TYPE "NotificationAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('SPLIT', 'PAYMENT', 'TRANSFER');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
