import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../../lib/auth";
import LinkAccountForm from "../../../../components/banks/LinkAccountClient";
import { prisma } from "@repo/db/client";
import { redirect } from "next/navigation";
export default async function LinkAccountPage() {
  // Example: get user from DB
  const session = await getServerSession(NEXT_AUTH);
  if(session?.user?.id)
  {
    // redirect("/auth/signin")
  }
  const userId = Number(session?.user?.id)
  const userDetails = await prisma.user.findFirst({
    where: {
      email: session?.user?.email
    },
    select: {
      number: true,
      id: true
    }
  })
  return (
    <div className="w-full min-h-screen px-4 py-8">
      <h1 className="mt-14 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
        Link Account
      </h1>
      <div className="flex items-center justify-center">
        <LinkAccountForm userId={Number(userDetails?.id)} number={userDetails?.number || ""} emailUser={session?.user?.email || ""} />
      </div>
    </div>
  );
}
