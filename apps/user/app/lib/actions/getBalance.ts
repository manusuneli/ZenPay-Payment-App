"use server"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import { prisma } from "@repo/db/client";

export async function getBalance() {
  try {
    const session = await getServerSession(NEXT_AUTH);
    const id = session?.user?.id;
    if (Number(id)) {
      const balance = await prisma.balance.findFirst({
        where: { userId: Number(id) }
      });
      return {
        balance
      }
    }
    return {
        error: "Unauthorized" 
    }
  } catch (e) {
    console.error("Error Occurred in Balance", e);
    return {
        error: "Internal Server Error" 
    }
  }
}
