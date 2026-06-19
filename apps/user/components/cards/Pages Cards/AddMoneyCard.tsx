"use client";
import { Card } from "@repo/ui/card";
import LabelledInput from "@repo/ui/labelledinput";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@repo/ui/button";
import { InputOTPGroup } from "../../inputotpgroup";
import { createOnRampTrans } from "../../../app/lib/actions/createOnRampTransactions";
import Link from "next/link";
import { createOffRampTrans } from "../../../app/lib/actions/createOffRampTransactions";

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

  const filteredAccounts = accounts.filter((acc) =>
    acc.bank.toLowerCase().includes(filter.toLowerCase())
  );

  async function validateMpin() {
    setIsLoading(true);
    if (!session.data?.user) return { msg: "User Not Loggedin!!" };

    const res = await fetch("/api/mpin/validate", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        Mpin: Mpin,
        email: session.data.user.email,
      }),
    });

    return res.json();
  }

  return (
    <div className="min-h-fit mx-2 sm:mx-5">
      <Card title={title}>
        <div className="mt-6 sm:mt-10">
          <div className="flex justify-between items-center mb-2">
            <div className="text-base sm:text-xl font-bold flex">Your Accounts (Select Account)</div>

            <Link href="/link-account">
              <Button className="bg-black text-white hover:bg-gray-800 text-sm sm:text-base px-4 py-2 rounded">
                Link Account
              </Button>
            </Link>
          </div>

          <input
            type="text"
            placeholder="Search bank..."
            className="w-full mb-4 p-2 border text-sm sm:text-base rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div className="w-full overflow-x-auto rounded-lg shadow border text-sm sm:text-base">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                      Bank
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                      Account Number
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                      IFSC
                    </th>
                  </tr>
                </thead>
              </table>

              <div className="max-h-40 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((acc, idx) => (
                        <tr
                          key={idx}
                          className={`cursor-pointer hover:bg-gray-100 ${selectedAccount === acc.accountNumber ? "bg-blue-100" : ""
                            }`}
                          onClick={() => {
                            setSelectedAccount(acc.accountNumber);
                            setProvider(acc.bank);
                            const meta = SUPPORTED_BANKS.find((b) => b.name === acc.bank);
                            setRedirectUrl(meta?.redirectUrl || "");
                          }}
                        >
                          <td className="px-3 sm:px-6 py-3 whitespace-nowrap">{acc.bank}</td>
                          <td className="px-3 sm:px-6 py-3 whitespace-nowrap font-mono">{acc.accountNumber}</td>
                          <td className="px-3 sm:px-6 py-3 whitespace-nowrap">{acc.ifsc}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4 text-center" colSpan={3}>
                          No matching accounts
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        <div className="ml-2 sm:ml-4 mt-6 sm:mt-8 w-full pr-2 sm:pr-4">
          <LabelledInput
            label="Amount"
            placeholder="Amount"
            onChangeFunc={(val) => {
              setValue(Number(val));
            }}
          />
        </div>

        <div className="px-2 sm:px-4 pt-4">
          <label className="block text-sm font-semibold mb-1">Selected Account Number</label>
          <input
            type="text"
            value={selectedAccount}
            readOnly
            className="w-full p-2 border rounded-lg bg-gray-100 text-sm"
            placeholder="Click on an account above"
          />
        </div>

        <div className="flex justify-center">
          <div className="flex justify-center mt-8 sm:mt-10 pb-6 sm:pb-8">
            {!showMpinBar ? (
              <Button
                onClickFunc={() => {
                  if (provider && value > 0 && selectedAccount) {
                    setShowMpinBar(true);
                  } else {
                    alert("Please enter all valid details.");
                  }
                }}
                className="bg-black text-white hover:bg-gray-800 text-sm sm:text-base px-6 py-2 rounded"
              >
                Next
              </Button>
            ) : (
              <div>
                <div className="text-sm font-bold flex justify-start py-1 border-b border-lg">Enter MPIN</div>
                <div className="py-2 flex justify-center">
                  <InputOTPGroup type="password" onChangeFunc={(pin) => setMpin(pin)} />
                </div>
                <div className="flex justify-center py-2 pt-2">
                  <Button
                    state={isLoading}
                    onClickFunc={async () => {

                      if (title === "Deposit") {
                        setIsLoading(true)
                        const res = await validateMpin();
                        if (res.msg === "Valid User") {
                          const result = await createOnRampTrans(provider, value, selectedAccount);

                          if (result?.bankToken) {
                            // console.log(redirectUrl)
                            window.location.href = `${redirectUrl}/deposit-to-wallet/${result.bankToken}`;
                          } else {
                            alert("Deposit failed: " + (result?.msg || "Unknown error"));
                          }
                        } else {
                          alert("Invalid MPIN");
                        }
                        setIsLoading(false);
                      }
                      else if (title === "Withdraw") {
                        setIsLoading(true)
                        const res = await validateMpin();
                        if (res.msg === "Valid User") {
                          const result = await createOffRampTrans(provider, value, selectedAccount);

                          if (result?.msg === "Withdrawal request is in Progress !!") {
                            // console.log(redirectUrl)
                            alert(result.msg);
                          } else {
                            alert("Deposit failed: " + (result?.msg || "Unknown error"));
                          }
                        } else {
                          alert("Invalid MPIN");
                        }
                        setIsLoading(false);
                      }
                    }}
                    className="bg-black text-white hover:bg-gray-800 text-sm sm:text-base px-6 py-2 rounded"
                  >
                    {isLoading ? "Transferring..." : "Transfer"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
