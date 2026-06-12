import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "../../../../../../../lib/auth";
import SplitBillPayClient from "../../../../../../../../components/spilt-bill/payClient";

export interface SplitParticipantPay {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  status: "FAILURE" | "REJECTED" | "PROCESSING" | "SUCCESS" | "PENDING";
}

export interface SplitCreatedByPay {
  name: string | null;
  email: string | null;
  number: string | null;
}

export interface SplitDetailsPay {
  createdAt: Date;
  totalAmount: number;
  description: string | null;
  split: SplitParticipantPay;
  createdByUser: SplitCreatedByPay;
}

export interface GetSplitResponsePay {
  splitDetails?: SplitDetailsPay;
  msg: string;
}

interface Props {
  params: { token: string; splitId: string; splitBillId: string };
}

async function getSplit(body: { token: string; splitId: number; splitBillId: number }): Promise<GetSplitResponsePay> {
  const splitEntry = await prisma.splitEntry.findFirst({
    where: {
      id: body.splitId,
      token: body.token,
      splitBillId: body.splitBillId
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      amount: true,
      status: true,
      splitBill: {
        select: {
          createdAt: true,
          totalAmount: true,
          description: true,
          createdByUser: {
            select: {
              name: true,
              email: true,
              number: true
            }
          }
        }
      }
    }
  });

  if (!splitEntry) {
    return { msg: "split_not_found" };
  }

  return {
    splitDetails: {
      createdAt: splitEntry.splitBill.createdAt,
      totalAmount: splitEntry.splitBill.totalAmount,
      description: splitEntry.splitBill.description,
      createdByUser: splitEntry.splitBill.createdByUser,
      split: {
        id: splitEntry.id,
        name: splitEntry.name,
        email: splitEntry.email,
        phone: splitEntry.phone,
        amount: splitEntry.amount,
        status: splitEntry.status
      }
    },
    msg: "valid"
  };
}

export default async function SplitBillPayPage({ params }: Props) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const b = await params;
  const body = {
    token: b.token,
    splitId: Number(b.splitId),
    splitBillId: Number(b.splitBillId)
  };

  const { splitDetails, msg } = await getSplit(body);

  if (msg !== "valid" || !splitDetails) {
    return <div className="p-10 text-center">Invalid or expired payment link.</div>;
  }

  return (
    <div className="mt-16 flex-auto">
      <SplitBillPayClient splitd={splitDetails} userSplit={splitDetails.split} body={body} />
    </div>
  );
}
