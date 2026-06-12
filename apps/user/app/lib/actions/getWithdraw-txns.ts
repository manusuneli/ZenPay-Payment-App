"use server"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import { prisma } from "@repo/db/client";

export async function getWithdrawTxns() {
  try {
    const session = await getServerSession(NEXT_AUTH);
    const id = session?.user?.id;
    if (id) {

      const txns = await prisma.offRampTransaction.findMany({
        where: { userId: Number(id) },
        orderBy: {
          startTime: "desc"
        }
      });

      let totalWithdrawalAmount = 0;

      txns.forEach(t => {
        if (t.status === "Success") {
          totalWithdrawalAmount += t.amount;
        }
      });

      const tx = txns.map(t => ({
        id: t.id,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.toBank
      }));

        return { 
            tx, totalWithdrawalAmount 
        }
    }
    return { 
        error: "Unauthorized"
    }
  } 
  catch (e) 
  {
    console.error("Error Occurred in Withdrawal", e);
    return { 
        error: "Internal Server Error" 
    };
  }
}
