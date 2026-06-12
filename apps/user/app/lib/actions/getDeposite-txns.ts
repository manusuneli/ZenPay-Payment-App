"use server"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import { prisma } from "@repo/db/client";

export async function getDepositeTxns() {
  try {
    const session = await getServerSession(NEXT_AUTH);
    const userId = session?.user?.id;


    if (userId) {
      const txns = await prisma.onRampTransaction.findMany({
        where: { userId: Number(userId) }
      });
      const len = txns.length;
      let totalDepositAmount = 0;
      txns.forEach(t => {
        if (t.status === "Success") {
          totalDepositAmount += t.amount;
        }
      });
      const txs = txns.map(t => ({
        id: t.id,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
      }));
      const tx = [...txs].reverse();
      
    return { 
        tx, totalDepositAmount, len
    }
    }
    return { 
        error: "Unauthorized"
    }
  } catch (e) {
    console.error("Error Occurred in Deposit", e);
    return { 
        error: "Internal Server Error" 
    };
  }
}
