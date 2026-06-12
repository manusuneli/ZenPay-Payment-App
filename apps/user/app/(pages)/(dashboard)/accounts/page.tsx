import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { FaLock, FaRegCreditCard } from "react-icons/fa";
import { NEXT_AUTH } from "../../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MinimalCards() {
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  const userId = Number(session.user.id)
  // console.log(userId)
  const user = await prisma.user.findUnique({
    where: { 
      id: userId
    },
    select: {
      accounts: {
        select: {
          accountNumber: true,
          id: true,
          ifsc: true
        }
      }
    }
  });

  // console.log(user)
  const cards = user?.accounts || [];
  // console.log(cards)
  return (
    <div className="min-h-screen p-6 flex-auto">

      <h1 className="mt-14 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
        Accounts
      </h1>
    <div className=" flex flex-col items-center gap-8">
      <Link
        href="/link-account"
        className="px-6 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl shadow transition duration-200"
        >
        + Add Card
      </Link>

      <div className="flex flex-wrap justify-center gap-6 w-full">
        {cards.map((card, index) => (
            <div
            key={card.id}
            className={`w-full sm:w-80 rounded-2xl bg-gradient-to-br ${
                index % 3 === 0
                ? "from-[#5e60ce] to-[#4361ee]"
                : index % 3 === 1
                ? "from-[#9d4edd] to-[#7b2cbf]"
                : "from-[#4895ef] to-[#4361ee]"
            } text-white p-6 shadow-lg transition-transform hover:scale-105`}
            >
            <div className="flex justify-between items-center mb-8">
              <FaRegCreditCard className="text-2xl" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                IFSC: {card.ifsc}
              </span>
            </div>
            <div className="text-xl font-mono tracking-widest mb-8">
              {card.accountNumber.slice(0, 4)} {card.accountNumber.slice(5, 9)} {card.accountNumber.slice(10, 14)} {card.accountNumber.slice(15, 19)}
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="uppercase text-xs text-gray-200">Expires</div>
                <div className="font-semibold">**/**</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="uppercase text-xs text-gray-200">CVV</div>
                <div className="flex items-center gap-1 font-semibold">
                  ***<FaLock className="text-green-400 ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
</div>
  );
}
