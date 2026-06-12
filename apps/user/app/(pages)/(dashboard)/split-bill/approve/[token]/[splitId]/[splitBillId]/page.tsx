import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "../../../../../../../lib/auth";
import SplitBillApprovalClient from "../../../../../../../../components/spilt-bill/approvalClient";

interface Props {
  params: { token: string, splitId: number, splitBillId: number };
}

async function getSplit(body : {token: string, splitId: number, splitBillId: number}) {
    const session = await getServerSession(NEXT_AUTH);
    if(!session?.user?.id)
    {
      redirect("/api/auth/signin");
    }
    const userId = Number(session?.user?.id);
      // console.log(body)

      // user se isliye nhi liya kyuki uske split dikhaate jo usne banaye hai wo nhi chahiye, 
      // jisme wo hai wo chahiye 
      const splitDetails = await prisma.splitBill.findMany({
          where: {
            id : Number(body.splitBillId),
          },
          select: {
            createdAt: true,
            createdByUser: {
              select: {
                name: true,
                number: true,
                email: true
              }
            },
            splits:{
              select: {
                id:true,
                name: true,
                email: true,
                phone: true,
                amount: true,
                description: true,
                status: true
              }
            },
            description: true,
            totalAmount: true
          }
      })

  return splitDetails[0];
}

export default async function SplitBillApprovalPage({ params }: Props) {
  
  const body = await params;
  // console.log(body);
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  const splitDetails = await getSplit(body);
  // console.log("HERE")
  // console.log(splitDetails)

  return (
    <div className="mt-20 flex-auto">
      <SplitBillApprovalClient body={body} splitDetails={splitDetails}/>
    </div>
  )
};


