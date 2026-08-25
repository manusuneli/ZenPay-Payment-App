"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search, Plus, CreditCard, ShieldCheck, KeyRound, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputOTPGroup } from "../../inputotpgroup";
import { createOnRampTrans } from "../../../app/lib/actions/createOnRampTransactions";
import { createOffRampTrans } from "../../../app/lib/actions/createOffRampTransactions";
import { useToast } from "../../../providers/ToastProvider";

const SUPPORTED_BANKS = [
  { name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com" },
  { name: "ZenBank", redirectUrl: `${process.env.NEXT_PUBLIC_ZENBANK_URL}` },
];

export function AddMoney({
  title,
  buttonThing,
  accounts,
}: {
  title: string;
  buttonThing: string;
  accounts: { bank: string; accountNumber: string; ifsc: string }[];
}) {
  const [value, setValue] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [provider, setProvider] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMpinBar, setShowMpinBar] = useState(false);
  const [Mpin, setMpin] = useState("");
  
  const session = useSession();
  const { showToast } = useToast();

  const filteredAccounts = accounts.filter((acc) =>
    acc.bank.toLowerCase().includes(filter.toLowerCase())
  );

  async function validateMpin() {
    setIsLoading(true);
    if (!session.data?.user) {
      showToast("User not logged in!", "error");
      setIsLoading(false);
      return { msg: "User Not Loggedin!!" };
    }

    try {
      const res = await fetch("/api/mpin/validate", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          Mpin: Mpin,
          email: session.data.user.email,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      showToast("Verification failed", "error");
      return { msg: "Error" };
    }
  }

  const handleNext = () => {
    if (provider && value > 0 && selectedAccount) {
      setShowMpinBar(true);
    } else {
      showToast("Please enter a valid amount and select an account.", "error");
    }
  };

  const handleTransfer = async () => {
    if (!Mpin || Mpin.length < 4) {
      showToast("Please enter a valid 4-digit MPIN", "error");
      return;
    }

    setIsLoading(true);
    const toastId = showToast("Processing transfer...", "loading");

    if (title === "Deposit") {
      const res = await validateMpin();
      if (res.msg === "Valid User") {
        const result = await createOnRampTrans(provider, value * 100, selectedAccount);
        if (result?.bankToken) {
          showToast("Redirecting to Bank gateway...", "success");
          window.location.href = `${redirectUrl}/deposit-to-wallet/${result.bankToken}`;
        } else {
          showToast(result?.msg || "Deposit failed", "error");
        }
      } else {
        showToast("Invalid MPIN", "error");
      }
      setIsLoading(false);
    } else if (title === "Withdraw") {
      const res = await validateMpin();
      if (res.msg === "Valid User") {
        const result = await createOffRampTrans(provider, value * 100, selectedAccount);
        if (result?.msg === "Withdrawal request is in Progress !!") {
          showToast(result.msg, "success");
          setShowMpinBar(false);
          setValue(0);
          setMpin("");
        } else {
          showToast(result?.msg || "Withdrawal failed", "error");
        }
      } else {
        showToast("Invalid MPIN", "error");
      }
      setIsLoading(false);
    }
  };

  const presetAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="p-6 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title} Funds</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Move funds securely from your linked accounts</p>
        </div>
        <Link href="/link-account">
          <button className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition duration-200 shadow-sm shadow-purple-500/10 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Link Account
          </button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Step 1: Account Selection and Amount */}
        {!showMpinBar ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Account Selector List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Select Source Account
              </label>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search bank..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500 transition duration-200"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>

              {/* Accounts table list */}
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-4 py-2.5">Bank</th>
                      <th className="px-4 py-2.5">Account No.</th>
                      <th className="px-4 py-2.5">IFSC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a2e]">
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((acc, idx) => {
                        const isSelected = selectedAccount === acc.accountNumber;
                        return (
                          <tr
                            key={idx}
                            onClick={() => {
                              setSelectedAccount(acc.accountNumber);
                              setProvider(acc.bank);
                              const meta = SUPPORTED_BANKS.find((b) => b.name === acc.bank);
                              setRedirectUrl(meta?.redirectUrl || "");
                            }}
                            className={`cursor-pointer hover:bg-purple-50/40 dark:hover:bg-purple-950/10 transition duration-150 ${
                              isSelected ? "bg-purple-50/80 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 font-semibold" : ""
                            }`}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">{acc.bank}</td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono">{acc.accountNumber}</td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono">{acc.ifsc}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="px-4 py-6 text-center text-slate-400 dark:text-slate-500" colSpan={3}>
                          No accounts found. Link a bank account first.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Account display */}
            {selectedAccount && (
              <div className="p-3 bg-purple-50/30 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/30 rounded-xl flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold">{provider}</span>
                  <span className="opacity-80">({selectedAccount})</span>
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

              {/* Amount selector pills */}
              <div className="flex flex-wrap gap-2 pt-1.5">
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

            {/* Next trigger button */}
            <button
              onClick={handleNext}
              disabled={!selectedAccount || value <= 0}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-1.5 transition duration-200 shadow-md shadow-purple-500/10"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          /* Step 2: MPIN authorization screen */
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
              <p className="text-xs text-slate-500 dark:text-slate-400">Authorize transfer of ₹{value.toLocaleString()} from {provider}</p>
            </div>

            <InputOTPGroup type="password" onChangeFunc={(pin) => setMpin(pin)} />

            {/* Submit / Cancel row */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
              <button
                onClick={handleTransfer}
                disabled={isLoading || Mpin.length < 4}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-purple-500/10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm</span>}
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
