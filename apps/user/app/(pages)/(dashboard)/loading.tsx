import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center gap-3">
      <FaSpinner className="animate-spin text-4xl text-[#6e3cbc]" />
      <p className="text-sm font-medium text-gray-500">Loading page...</p>
    </div>
  );
}
