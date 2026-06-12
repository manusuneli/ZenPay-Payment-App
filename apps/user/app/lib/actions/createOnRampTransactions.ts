"use server";

import { prisma } from "@repo/db/client";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "../auth";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export async function createOnRampTrans(provider: string, amount: number, selectedAccount: string) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
    return { msg: "Unauthenticated request" };
  }
  // console.log(provider)
  if (provider !== "ZenBank") {
    return {
      msg: `Deposit skipped: ${provider} is an external bank (no token flow)`,
    };
  }

  const walletToken = crypto.randomUUID();

  const createdEntry = await prisma.onRampTransaction.create({
    data: {
      status: "Processing",
      userId: Number(session.user.id),
      provider,
      accountNumber: selectedAccount,
      startTime: new Date(),
      amount: Math.round(amount * 100), // paise
      walletToken,
      bankToken: null,
    },
    select: {
      user: {
        select: {
          accounts: {
            where: {
              accountNumber: selectedAccount
            },
            select: {
              accessToken: true
            }
          }
        }
      },
      id: true
    }
  });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ZENBANK_URL}/api/deposit-for-bank/get-bank-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletToken: walletToken,
        amount: (amount*100),
        accessToken: createdEntry.user.accounts[0]?.accessToken,
        provider: provider
      }),
    });

    const data = await res.json();
    // console.log(data)
    if (!res.ok) {
      console.error("ZenBank Error:", data);
      return {
        msg: data.msg,
        error: data,
      };
    }

    if (!data?.bankToken) {
      return {
        msg: "ZenBank Invalid Token Missed",
      };
    }
    await prisma.onRampTransaction.update({
      where: { id: createdEntry.id },
      data: { bankToken: data.bankToken },
    });
  
    return {
      msg: "ZenBank deposit initiated",
      bankToken: data?.bankToken,
      bankResponse: data,
    };

  } catch (error) {
    console.error("ZenBank connection error:", error);
    return {
      msg: "Failed to contact ZenBank",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
