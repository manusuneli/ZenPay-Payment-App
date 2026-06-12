"use client";

import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { SplitItem } from "../../../app/(pages)/(dashboard)/split-bill/page";
import { useState } from "react";

export function SplitBillList({ splits }: { splits?: SplitItem[][] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {splits?.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-sm border rounded-xl bg-gray-50">
          No splits yet
        </div>
      ) : (
        splits?.map((group, idx) => (
          <div
            key={idx}
            className="rounded-xl border shadow-sm bg-white overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-4 cursor-pointer bg-[#f1ebfc]"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {group[0]?.description}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {group.length} people • ₹
                  {group
                    .reduce((a, b) => a + (b.amount)/100, 0)
                    .toFixed(2)}{" "}
                  total
                </p>
              </div>
              {expanded === idx ? <FaChevronDown /> : <FaChevronRight />}
            </div>

            {expanded === idx && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {group.map((p, i) => {
                    let bgClass = "bg-yellow-50";
                    let textClass = "text-yellow-600";
                    let statusLabel = "Pending";

                    if (p.paid) {
                      bgClass = "bg-green-50";
                      textClass = "text-green-600";
                      statusLabel = "Paid";
                    } else if (p.status === "REJECTED") {
                      bgClass = "bg-red-50";
                      textClass = "text-red-600";
                      statusLabel = "Rejected";
                    }

                    return (
                      <div
                        key={i}
                        className={`flex justify-between items-center p-4 rounded-xl border ${bgClass} min-w-[220px] w-max`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-[#d6c4f7] flex items-center justify-center font-semibold text-[#6e3cbc]">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {p.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {p.email}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {p.phoneNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-semibold text-gray-900">
                            ₹{((p.amount)/100).toFixed(2)}
                          </p>
                          <p
                            className={`text-xs mt-1 font-medium ${textClass}`}
                          >
                            {statusLabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
