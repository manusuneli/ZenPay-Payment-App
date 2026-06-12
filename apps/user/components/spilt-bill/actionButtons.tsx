"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleSplitActionApproval } from "../../app/lib/actions/handleSplitActionApprovalPage";
import MPinInput from "../p2p/send/mPinInputs";
import { useSession } from "next-auth/react";

interface Props {
  splitId: number;
  token: string;
  splitBillId: number;
}

export default function ActionButtons({ splitId, token, splitBillId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showMpinBar, setShowMpinBar] = useState(false);
  const [mPin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  async function validateMpin() {
    const res = await fetch("/api/mpin/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Mpin: mPin, email: session.data?.user.email }),
    });
    return res.json();
  }

  async function handleSubmitApproval() {
    setIsLoading(true);
    const valid = await validateMpin();
    if (valid.msg !== "Valid User") {
      alert("Invalid MPIN");
      // setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("splitId", splitId.toString());
    formData.append("splitBillId", splitBillId.toString());
    formData.append("token", token);
    formData.append("actionType", "APPROVED");

    startTransition(async () => {
      const result = await handleSplitActionApproval(formData);
      if (result?.redirect) {
        router.push(result.redirect);
      }
    });

    setIsLoading(false);
  }

  async function handleReject() {
    const formData = new FormData();
    formData.append("splitId", splitId.toString());
    formData.append("splitBillId", splitBillId.toString());
    formData.append("token", token);
    formData.append("actionType", "REJECTED");

    startTransition(async () => {
      const result = await handleSplitActionApproval(formData);
      if (result?.redirect) {
        alert("Split Rejected !!");
        router.push(result.redirect);
      }
    });
  }

  return (
    <>
      {!showMpinBar ? (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <button
            type="button"
            disabled={isPending}
            onClick={handleReject}
            className="w-full sm:w-auto px-6 py-2 text-sm rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
          >
            Reject
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowMpinBar(true)}
            className="w-full sm:w-auto px-6 py-2 text-sm rounded-full bg-[#a259ff] text-white hover:bg-[#8a3ee6] transition disabled:opacity-50"
          >
            Approve & Pay
          </button>
        </div>
      ) : (
        <div className="flex justify-center pt-6 w-full">
          <MPinInput isLoading={isLoading} onSubmit={handleSubmitApproval} onChange={setMpin} />
        </div>
      )}
    </>
  );
}
