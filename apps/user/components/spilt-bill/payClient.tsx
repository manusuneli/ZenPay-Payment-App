"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { InputOTPGroup } from "../../components/inputotpgroup";
import { SplitDetailsPay, SplitParticipantPay } from "../../app/(pages)/(dashboard)/split-bill/pay/[token]/[splitId]/[splitBillId]/page";
import Header from "./header";
import Metadata from "./metaData";
import YourSplitDetail from "./detailsCards";
import { getBalance } from "../../app/lib/actions/getBalance";
import { handleSplitPay } from "../../app/lib/actions/handleSplitPay";

interface Props {
  token: string; 
  splitId: number; 
  splitBillId: number 
};
async function validateMpin(Mpin: string, email: string) {
  const res = await fetch("/api/mpin/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Mpin, email: email }),
  });
  return res.json();
}

export default function SplitBillPayPage({
  splitd,
  userSplit,
  body
}: {
  splitd: SplitDetailsPay;
  userSplit: SplitParticipantPay;
  body: Props
}) {

  useEffect(() => {
    async function balance()
    {
      const b = await getBalance();
      setBalance(Number(b.balance?.amount) || 0.00);
    }
    balance();
  })
  const [balance, setBalance] = useState(0.00);
  const router = useRouter();
  const { data: session } = useSession();
  const [mpin, setMpin] = useState("");
  const [isProcessing, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    if (!session?.user) {
      alert("Not logged in");
      setIsLoading(false);
      return;
    }
    const amount = splitd.split.amount;

    if(balance < amount)
    {
      alert("Insufficient Balance !!");
      router.push("/transfer/deposit")
    }
    else 
    {
      const resValidationMPin = await validateMpin(mpin, session?.user?.email || "");
      if (resValidationMPin.msg === "Valid User") {
        const b = await body;
        const res = await handleSplitPay(mpin, balance, b)
        if (res.msg === "Payment Success") {
          alert("Split Bill Paid Successfully !!")
          router.push("/split-bill");
        } 
        else alert(res.msg);
      } 
      else alert("Invalid MPIN");
    }
    setIsLoading(false);
  }

  return (
    <div className="w-full min-h-screen bg-[#fdf0f6] py-10 px-4 sm:px-6 md:px-10">
      <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
        <Header title="Pay Your Split Share" />

        <div className="px-4 sm:px-6 md:px-10 xl:px-16 pt-6 pb-4">
          <div className="flex justify-between items-center bg-gray-50 rounded-xl px-6 py-4 shadow-inner">
            <span className="text-gray-700 text-sm font-medium">Available Balance</span>
            <span className="text-green-600 text-xl font-bold">₹{balance/100}</span>
          </div>
        </div>

        <div className="w-full px-4 sm:p-6 md:p-10 xl:p-10 space-y-8">
          <Metadata
            description={splitd.description || "Split Payment"}
            createdBy={splitd.createdByUser.name || ""}
            createdAt={new Date(splitd.createdAt)}
          />

          <YourSplitDetail entry={userSplit} />

          {userSplit.status === "PROCESSING" && (
            <form
              onSubmit={(e) =>
                startTransition(() => {
                  handleSubmit(e);
                })
              }
              className="space-y-6"
            >
              <div className="font-semibold text-gray-700 border-b pb-2">
                Enter your MPIN to authorize payment
              </div>

              <div className="flex justify-center">
                <InputOTPGroup
                  type="password"
                  onChangeFunc={(pin) => setMpin(pin)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isProcessing || isLoading}
                  className={`w-full sm:w-auto px-6 py-2 text-sm rounded-full
                    ${isProcessing || isLoading ? "bg-[#a259ff]/60" : "bg-[#a259ff]"}
                    text-white hover:bg-[#8a3ee6] transition disabled:opacity-50 mb-6`}
                >
                  {isLoading ? (
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-200 animate-spin fill-white mx-auto"
                      viewBox="0 0 100 101"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M100 50.6c0 27.6-22.4 50-50 50S0 78.2 0 50.6 22.4 0.6 50 0.6s50 22.4 50 50z" fill="currentColor"/>
                      <path d="M93.97 39.04c2.42-.64 3.89-3.13 3.03-5.49-1.71-4.73-4.14-9.18-7.19-13.2C85.85 15.12 80.88 10.72 75.21 7.41 69.54 4.1 63.28 1.94 56.77 1.05c-5 .69-10.07.77-15.03 1.62-2.47.42-3.92 2.92-3.28 5.35.63 2.43 3.1 3.84 5.52 3.49 3.8-.55 7.66-.57 11.47-.05 5.32.73 10.45 2.51 15.08 5.25 4.64 2.75 8.7 6.34 11.96 10.6 2.34 2.89 4.24 6.27 5.6 9.83 1.01 2.34 3.48 3.79 5.9 3.14z" fill="currentFill"/>
                    </svg>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
