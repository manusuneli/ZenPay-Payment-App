"use client";

import { ChevronDown, ChevronRight, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { SplitItem } from "../../../app/(pages)/(dashboard)/split-bill/page";
import { useState } from "react";

export function SplitBillList({ splits }: { splits?: SplitItem[][] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {splits?.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-slate-350" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No split transactions yet.</p>
        </div>
      ) : (
        splits?.map((group, idx) => {
          const totalAmount = group.reduce((a, b) => a + (b.amount) / 100, 0);
          const groupTitle = group[0]?.description || "Expense Split";
          const isExpanded = expanded === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1a2e] overflow-hidden shadow-sm transition duration-200"
            >
              {/* Accordion Trigger Header */}
              <div
                className={`flex justify-between items-center p-4 cursor-pointer transition ${
                  isExpanded 
                    ? "bg-purple-50/20 dark:bg-purple-950/10 border-b border-slate-100 dark:border-slate-800" 
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-800/10"
                }`}
                onClick={() => setExpanded(isExpanded ? null : idx)}
              >
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {groupTitle}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
                    {group.length} people • <span className="font-semibold text-purple-600 dark:text-purple-400">₹{totalAmount.toFixed(2)}</span> total
                  </p>
                </div>
                <div className="text-slate-400 dark:text-slate-500">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>

              {/* Accordion Content Details */}
              {isExpanded && (
                <div className="p-5 bg-slate-50/50 dark:bg-[#0d0d1a]/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.map((p, i) => {
                      const avatarInit = p.name.charAt(0).toUpperCase();
                      
                      let badgeClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                      let statusText = "Pending";
                      let borderStyle = "border-slate-200 dark:border-slate-800";

                      if (p.paid) {
                        badgeClass = "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400";
                        statusText = "Paid";
                        borderStyle = "border-green-100 dark:border-green-900/20";
                      } else if (p.status === "REJECTED") {
                        badgeClass = "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400";
                        statusText = "Rejected";
                        borderStyle = "border-red-100 dark:border-red-900/20";
                      }

                      return (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#1a1a2e] border ${borderStyle} shadow-sm`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                              {avatarInit}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {p.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              ₹{(p.amount / 100).toFixed(2)}
                            </p>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 ${badgeClass}`}>
                              {statusText}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
