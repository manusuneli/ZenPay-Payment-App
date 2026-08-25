"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Plus, CreditCard, ShieldCheck, KeyRound, Loader2, ArrowRight, UserCheck, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputOTPGroup } from "../inputotpgroup";
import { transferP2P } from "../../app/lib/actions/p2ptransfer";
import { useToast } from "../../providers/ToastProvider";

export interface RawContact {
  contactId: number;
  contactName: string;
  contactEmail: string;
  contactNumber?: string;
}

export interface SendAndSearchProps {
  AllMyContacts: RawContact[];
  numberOfContacts: number;
}

export function SendAndSearchContacts({ AllMyContacts, numberOfContacts }: SendAndSearchProps) {
  const [contacts, setContacts] = useState<RawContact[]>([]);
  const [search, setSearch] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [value, setValue] = useState(0);
  const [Mpin, setMpin] = useState("");
  const [showMpinBar, setShowMpinBar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    setContacts(AllMyContacts);
  }, [AllMyContacts]);

  const filtered = contacts.filter(
    (c) =>
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
      (c.contactNumber && c.contactNumber.includes(search))
  );

  const displayed = typeof numberOfContacts === "number" ? filtered.slice(0, numberOfContacts) : filtered;

  async function validateMpin() {
    try {
      const res = await fetch("/api/mpin/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Mpin, email: session.data?.user?.email }),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      return { msg: "Error" };
    }
  }

  async function handleTransfer() {
    if (!Mpin || Mpin.length < 4) {
      showToast("Please enter a valid 4-digit MPIN", "error");
      return;
    }

    setIsLoading(true);
    const toastId = showToast("Sending payment...", "loading");

    try {
      const valid = await validateMpin();
      if (valid.msg === "Valid User") {
        const res = await transferP2P(selectedNumber, value * 100);
        if (res.msg === "Transaction Success") {
          showToast("Payment sent successfully!", "success");
          router.push("/transactions/p2p");
        } else {
          showToast(res.msg || "Transaction failed", "error");
        }
      } else {
        showToast("Invalid MPIN. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to complete transfer", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const handleNext = () => {
    if (selectedNumber && value > 0) {
      setShowMpinBar(true);
    } else {
      showToast("Please enter a valid amount and select a recipient.", "error");
    }
  };

  const presetAmounts = [100, 200, 500, 1000];

  // Find currently selected contact object
  const selectedContact = contacts.find((c) => c.contactNumber === selectedNumber);

  return (
    <div className="p-6 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 font-sans">Send Money</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Transfer money to friends instantly</p>
        </div>
      </div>

      <div className="space-y-6">
        {!showMpinBar ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Horizontal Contacts Avatar Chips */}
            {contacts.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Quick Select
                </label>
                <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-none scroll-smooth">
                  {contacts.map((c) => {
                    const initials = c.contactName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();
                    const isSelected = selectedNumber === c.contactNumber;

                    return (
                      <div
                        key={c.contactId}
                        onClick={() => setSelectedNumber(c.contactNumber || "")}
                        className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 transition-transform active:scale-95"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition duration-200 ${
                            isSelected
                              ? "bg-purple-600 text-white ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-[#1a1a2e]"
                              : "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 hover:scale-105"
                          }`}
                        >
                          {initials}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 max-w-[60px] truncate text-center">
                          {c.contactName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recipient Number Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Recipient Details
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contacts by name, email or phone..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 transition duration-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Number entry / Selected recipient */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 transition duration-200"
                  value={selectedNumber}
                  onChange={(e) => setSelectedNumber(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            {/* Recipient highlight chip */}
            {selectedContact && (
              <div className="p-3 bg-purple-50/30 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/30 rounded-xl flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold">{selectedContact.contactName}</span>
                  <span className="opacity-80">({selectedContact.contactEmail})</span>
                </div>
              </div>
            )}

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 dark:text-slate-400 text-lg">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={value || ""}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 transition duration-200"
                />
              </div>

              {/* Amount pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setValue(amt)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0d0d1a] hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    + ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleNext}
              disabled={!selectedNumber || value <= 0}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-1.5 transition duration-200 shadow-md shadow-purple-500/10"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          /* Step 2: MPIN Auth screen */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 flex flex-col items-center justify-center py-4"
          >
            <div className="text-center space-y-1 mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/50 rounded-2xl w-max mx-auto text-purple-600 dark:text-purple-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Enter secure MPIN</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send ₹{value.toLocaleString()} to {selectedContact?.contactName || selectedNumber}
              </p>
            </div>

            <InputOTPGroup type="password" onChangeFunc={(pin) => setMpin(pin)} />

            {/* Button group */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
              <button
                onClick={handleTransfer}
                disabled={isLoading || Mpin.length < 4}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-purple-500/10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Payment</span>}
              </button>
              <button
                onClick={() => {
                  setShowMpinBar(false);
                  setMpin("");
                }}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold text-sm transition duration-200"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
