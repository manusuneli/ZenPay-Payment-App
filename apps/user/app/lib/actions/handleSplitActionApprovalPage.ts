"use server"

import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../auth";
import { prisma } from "@repo/db/client";

export async function handleSplitActionApproval(formData: FormData): Promise<{ redirect: string }> {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    return { redirect: "/api/auth/signin" };
  }

  const splitId = Number(formData.get("splitId"));
  const splitBillId = Number(formData.get("splitBillId"));
  const token = String(formData.get("token"));
  const actionType = String(formData.get("actionType"));
  if (actionType === "REJECTED") {
    await prisma.$transaction(async (tx) => {
      const getDetailsOfEntry = await tx.splitEntry.update({
        where: { id: splitId },
        data: { status: "REJECTED" },
        select: {
          splitBill: {
            select: { createdByUserId: true }
          },
          description: true,
          amount: true,
          notifications: {
            select: { message: true }
          },
          id: true
        }
      });

      const initiatorId = Number(getDetailsOfEntry.splitBill.createdByUserId);
      const rejectedAmount = (getDetailsOfEntry.amount) || 0;
      const rejectedDesc = getDetailsOfEntry.description || "";
      const originalMsg = getDetailsOfEntry.notifications[0]?.message || "";

      await tx.notification.create({
        data: {
          userId: initiatorId,
          title: `Split Rejected: ₹${(rejectedAmount/100)} (${session?.user?.name || "Someone"})`,
          message:
            originalMsg ||
            `The split of ₹${(rejectedAmount/100)} "${rejectedDesc}" was rejected by ${session?.user?.name || "the user"}.`,
          type: "SPLIT" as const,
          action: "VIEW",
          splitId: getDetailsOfEntry.id
        }
      });
    });
  return { redirect: "/notificationsnpendings" };
}


  else if (actionType === "APPROVED") {
    const newToken = crypto.randomUUID();
    await prisma.$transaction(async (tx) => {
      await tx.notification.updateMany({
        where: { splitId: splitId, action: "APPROVE" },
        data: { action: "PAY" }
      });

      await tx.splitEntry.updateMany({
        where: { token: token },
        data: { token: newToken, status: "PROCESSING" }
      });
    });
    return { redirect: `/split-bill/pay/${newToken}/${splitId}/${splitBillId}` };
  }

  throw new Error("Invalid actionType received");
}
