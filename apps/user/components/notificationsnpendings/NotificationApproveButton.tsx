"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getRouterDetails } from "../../app/lib/actions/getRouteApprove";

export function NotificationsApproveButton({
  id,
  action,
  status
}: {
  id: number,
  action: "APPROVE" | "PAY",
  status?: string
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (status === "REJECTED" || status === "SUCCESS" || status === "PAID" || loading) return;
    setLoading(true);
    startTransition(async () => {
      const routerDetails = await getRouterDetails({ id, action });
      if (routerDetails) {
        const path = action === "APPROVE" ? "approve" : "pay";
        router.push(`/split-bill/${path}/${routerDetails.token}/${routerDetails.splitId}/${routerDetails.splitBillId}`);
      }
      setLoading(false);
    });
  };

  // show green pill if already paid / success
  if (status === "SUCCESS" || status === "PAID") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
        Paid
      </span>
    );
  }

  // show rejected pill
  if (status === "REJECTED") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#dc2626]">
        Rejected
      </span>
    );
  }

  // otherwise show action button
  return (
    <button
      onClick={handleClick}
      disabled={loading || isPending}
      className={`text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition duration-200
        ${action === "APPROVE" ? "bg-[#a259ff] text-white" : "bg-[#f14668] text-white"}
        hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading || isPending ? (
        <svg
          aria-hidden="true"
          className="inline w-4 h-4 text-gray-200 animate-spin fill-white"
          viewBox="0 0 100 101"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M100 50.6c0 27.6-22.4 50-50 50S0 78.2 0 50.6 22.4 0.6 50 0.6s50 22.4 50 50z" fill="currentColor" />
          <path d="M93.97 39.04c2.42-.64 3.89-3.13 3.03-5.49-1.71-4.73-4.14-9.18-7.19-13.2C85.85 15.12 80.88 10.72 75.21 7.41 69.54 4.1 63.28 1.94 56.77 1.05c-5 .69-10.07.77-15.03 1.62-2.47.42-3.92 2.92-3.28 5.35.63 2.43 3.1 3.84 5.52 3.49 3.8-.55 7.66-.57 11.47-.05 5.32.73 10.45 2.51 15.08 5.25 4.64 2.75 8.7 6.34 11.96 10.6 2.34 2.89 4.24 6.27 5.6 9.83 1.01 2.34 3.48 3.79 5.9 3.14z" fill="currentFill" />
        </svg>
      ) : (
        action === "APPROVE" ? "Approve" : "Pay Now"
      )}
    </button>
  );
}
