import React from "react";
import { FaClock, FaCreditCard, FaRegListAlt, FaBolt } from "react-icons/fa";
interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  classes: string;
}

export function SplitBillCards({
  paymentsPending,
  pendingCredits,
  totalSplits,
  activeSplits,
}: {
  paymentsPending: number;
  pendingCredits: number;
  totalSplits: number;
  activeSplits: number;
}) {
  return (
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card
        icon={<FaClock className="text-purple-600 text-xl" />}
        label="Pending payments"
        value={`₹ ${paymentsPending}`}
        classes="bg-purple-50 border-purple-200 text-purple-800"
      />
      <Card
        icon={<FaCreditCard className="text-green-600 text-xl" />}
        label="Pending credits"
        value={`₹ ${pendingCredits}`}
        classes="bg-green-50 border-green-200 text-green-800"
      />
      <Card
        icon={<FaRegListAlt className="text-blue-600 text-xl" />}
        label="Total splits"
        value={totalSplits}
        classes="bg-blue-50 border-blue-200 text-blue-800"
      />
      <Card
        icon={<FaBolt className="text-yellow-600 text-xl" />}
        label="Active splits"
        value={activeSplits}
        classes="bg-yellow-50 border-yellow-200 text-yellow-800"
      />
    </div>
  );
}

function Card({ icon, label, value, classes }: CardProps) {
  return (
    <div className={`p-4 rounded-xl shadow-sm ${classes} border`}>
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <h4 className="text-gray-600 text-sm font-medium">{label}</h4>
      </div>
      <p className={`text-2xl font-semibold`}>{value}</p>
    </div>
  );
}
