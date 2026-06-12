"use server";

import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../auth";
import { prisma } from "@repo/db/client";
import { redirect } from "next/navigation";
import crypto from "crypto";

interface CreateSplitProps {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  amount: number;
  description?: string;
  paid: boolean;
}

export async function CreateSplit(
  newGroup: CreateSplitProps[],
  totalAmt: number,
  userDesc: string
) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
    return { msg: "Unauthenticated request" };
  }

  const ownerId = session.user.id;

  const phoneNumbers = newGroup.map((e) => e.phoneNumber);

  // Duplicate phone number check
  const uniquePhoneNumbers = new Set(phoneNumbers);
  if (uniquePhoneNumbers.size !== phoneNumbers.length) {
    return {
      msg: "Duplicate phone numbers are not allowed in the split.",
    };
  }

  const contactMap = new Map<string, { name: string; number: string }>();
  newGroup.forEach(e => {
    contactMap.set(e.phoneNumber, { name: e.name, number: e.phoneNumber });
  });
  const uniqueContacts = Array.from(contactMap.values());
  // Check karna hai ki saare phoneNumbers registered users ke hai
  const existingUsers = await prisma.user.findMany({
    where: { number: { in: phoneNumbers } },
    select: { number: true, id: true },
  });

  const existingNumberSet = new Set(existingUsers.map((u) => u.number));
  const missingNumbers = phoneNumbers.filter((n) => !existingNumberSet.has(n));

  if (missingNumbers.length > 0) {
    return {
      msg: `These phone numbers are not registered: ${missingNumbers.join(", ")}`,
    };
  }

  // Check karna hai ki user khud na ho split me
  const includesSelf = existingUsers.some((u) => u.id === Number(ownerId));
  if (includesSelf) {
    return {
      msg: "You cannot include yourself in the split bill.",
    };
  }

  
  const newContactsToInsert = newGroup
    .filter(e => !existingNumberSet.has(e.phoneNumber))
    .map(e => ({
      userId: Number(ownerId),
      contactId: Number(e.userId)
    }));

    if (newContactsToInsert.length > 0) {
    await prisma.contact.createMany({
      data: newContactsToInsert
    });
    }
  
  
  try {
    await prisma.$transaction(async (tx) => {
      const splitBill = await tx.splitBill.create({
        data: {
          createdByUserId: Number(ownerId),
          totalAmount: totalAmt * 100,
          description: userDesc || null,
        },
      });

      const splitEntries = newGroup.map((e) => {
        const user = existingUsers.find((u) => u.number === e.phoneNumber);
        return {
          userId: user?.id || 0,
          name: e.name,
          email: e.email,
          phone: e.phoneNumber,
          amount: (e.amount) * 100,
          description: e.description || null,
          status: "PENDING" as const, // Yaha pe enum ka dhyan rakhna
          token: crypto.randomUUID(),
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 din ka expiry
          paidAt: e.paid ? new Date() : null,
          splitBillId: splitBill.id,
        };
      });

      await tx.splitEntry.createMany({ data: splitEntries });

      const createdEntries = await tx.splitEntry.findMany({
        where: {
          token: {
            in: splitEntries.map((entry) => entry.token!),
          },
        },
        select: {
          id: true,
          userId: true,
          amount: true,
          description: true,
        },
      });
      const senderName = session.user.name;
      const notificationData = createdEntries.map((entry) => ({
        userId: Number(entry.userId),
        title: `Split from ${senderName}: ₹${(entry.amount)/100} pending`,
        message: entry.description
          ? `${entry.description} — split from ${senderName}`
          : `You've been split ₹${(entry.amount)/100} by ${senderName}. Please review and approve.`,
        type: "SPLIT" as const,
        action: "APPROVE" as const,
        createdAt: new Date(),
        splitId: entry.id, // relation to SplitEntry
      }));


      await tx.notification.createMany({
        data: notificationData,
      });
    });

    return { msg: "Split successfully created" };
  } catch (e) {
    console.error("CreateSplit error:", e);
    return { msg: "Something went wrong while creating split" };
  }
  return {};
}
