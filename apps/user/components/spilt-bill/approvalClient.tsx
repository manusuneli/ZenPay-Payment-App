import { prisma } from "@repo/db/client";
import ActionButtons from "./actionButtons";
import YourSplitDetail from "./detailsCards";
import Header from "./header";
import Metadata from "./metaData";
import ParticipantList, { SplitBillApprovalProps } from "./participants";

interface checkBodyProps {
  token: string;
  splitId: number;
  splitBillId: number;
}

async function checkBody(body: checkBodyProps)
{
  
  const token = await prisma.splitEntry.findFirst({
      where: {
        token: body.token,
        id: Number(body.splitId),
        splitBill: {
          id: Number(body.splitBillId)
        }
      }
  })

  if(!token)
  {
    return {
      msg: "wrong Credentials"
    }
  }

  return {
    msg: "Continue with credentials"
  }
}

export default async function SplitBillApproval({ splitDetails, body }: SplitBillApprovalProps) {
  if (!splitDetails) {
    return <div className="p-6 text-center">Split not found...</div>;
  }

  const res = await checkBody(body);  
  if(res?.msg == "wrong Credentials")
  {
      return (
        <div className="mt-16 flex-auto items-center">
          Sorry Wrong Credentails, TRY AGAIN !!
        </div>
      )
  }
  const userSplit = splitDetails.splits.find((entry) => entry.id === Number(body.splitId));

  return (
    <div className="w-full min-h-screen bg-[#fdf0f6] py-10 px-4 sm:px-6 md:px-10">
      <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
        <Header title="Approve Split Payment" />
        <div className="w-full p-4 sm:p-6 md:p-10 xl:p-16 space-y-8">
          <Metadata
            description={splitDetails.description || ""}
            createdBy={splitDetails.createdByUser.name || ""}
            createdAt={new Date(splitDetails.createdAt)}
          />
          <ParticipantList
            participants={splitDetails.splits}
            total={Number(splitDetails.totalAmount)/100}
          />
          {userSplit && <YourSplitDetail entry={userSplit} />}
          {userSplit?.status === "PENDING" && (
            <ActionButtons splitId={userSplit.id} token={body.token} splitBillId={body.splitBillId} />
          )}
        </div>
      </div>
    </div>
  );
}
