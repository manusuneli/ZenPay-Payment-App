"use server"

import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../auth";
import { prisma } from "@repo/db/client";
import { redirect } from "next/navigation";

export async function getSplitDetails() {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
    return { msg: "Unauthenticated request" };
  }

  const userId = Number(session.user.id);

  try {
    const usersAllSplitEntry = await prisma.splitEntry.findMany({
      where: { userId },
    });

    const usersAllSplitBills = await prisma.splitBill.findMany({
      where: { createdByUserId: userId },
      include: { splits: true },
    });

    let paymentsPending = 0;
    let pendingCredits = 0;
    let earnedCredits = 0;

    usersAllSplitEntry.forEach(entry => {
      if (entry.status === "PENDING") {
        paymentsPending += entry.amount;
      }
    });

    usersAllSplitBills.forEach(bill => {
      bill.splits.forEach(entry => {
        if (entry.status === "PENDING") {
          pendingCredits += entry.amount;
        } else if (entry.status === "SUCCESS") {
          earnedCredits += entry.amount;
        }
      });
    });

    const activeSplits = usersAllSplitBills.filter(bill =>
        bill.splits.some(split => split.status === "PENDING")
    ).length;
    
    // ye log badiya hai 
    const allSplits = usersAllSplitBills.map(bill =>
    bill.splits.map(({ phone, ...split }) => ({
        ...split,
        phoneNumber: phone,
        description: bill.description ?? "No description",
        paid: split.status === "SUCCESS",
    }))
    );

    return {
      paymentsPending,
      pendingCredits,
      earnedCredits,
      totalSplits: usersAllSplitBills.length,
      activeSplits,
      allSplits,
    };
  } catch (e) {
    console.error("getSplitDetails error:", e);
    return { msg: "Something went wrong" };
  }
}
