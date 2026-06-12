"use server";

import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../auth";
import { prisma } from "@repo/db/client";
import { redirect } from "next/navigation";

interface getRouterDetailsProps {
    id : number;
    action: "APPROVE" | "PAY" | "VIEW"
}

export async function getRouterDetails ({id, action}: getRouterDetailsProps) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
    return { msg: "Unauthenticated request" };
  }

  const userId = session.user.id;
  
  try {

  const splitDetailsForRoute = await prisma.notification.findUnique({
    where: {
        id : id,
        userId: Number(userId),
        action: action
    },
    include: {
        splitEntry: {
            select: {
                token: true,
                id: true,
                splitBillId: true
            }
        },
    },
    })
    if (!splitDetailsForRoute) {
    throw new Error("Notification not found or unauthorized");
    }
    return { 
        token: splitDetailsForRoute?.splitEntry?.token,
        splitId: splitDetailsForRoute?.splitEntry?.id,
        splitBillId: splitDetailsForRoute?.splitEntry?.splitBillId
    }
  } catch (e) {
    console.error("CreateSplit error:", e);
    return { msg: "Something went wrong while creating split" };
  }
  return {};
}
