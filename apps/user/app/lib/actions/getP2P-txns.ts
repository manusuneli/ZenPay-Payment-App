"use server"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import { prisma } from "@repo/db/client";

export async function getP2PTxns() {
  try {
    const session = await getServerSession(NEXT_AUTH);
    const id = session?.user?.id;
    let totalPaid = 0;
    let totalReceived = 0;
    if (id) {
      const txns = await prisma.p2pTransfer.findMany({
        where: { fromUserId: Number(id) },
        orderBy: {
          timestamp: 'desc'
        },
        include: {
          toUser: true
        }
      });
      
      txns.forEach((t) => {
        if (t.paymentModeP2P === "paid") {
          totalPaid += t.amount;
        } else if (t.paymentModeP2P === "received") {
          totalReceived += t.amount;
        }
      });
      
      const tx = txns.map(t => ({
        id: t.id,
        time: t.timestamp,
        amount: t.amount,
        toUserId: t.toUserId,
        toUserName: t.toUserName,
        paymentModeP2P: t.paymentModeP2P,
        type: t.type
      }));
      
      return {
          tx, totalPaid, totalReceived 
      }
    }
    return { 
        error: "Unauthorized"
    }
  } catch (e) {
    console.error("Error Occurred in P2P", e);
    return { 
        error: "Internal Server Error" 
    };
  }
  return null;
}

