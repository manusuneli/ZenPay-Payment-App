import React, { JSX } from "react";
import { TransferButton } from "../../../../components/buttons/buttonsUsed";

export default function TransferLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div className="max-w-screen">
            <div className="px-2 mt-20 text-3xl sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-10">
                Quick Transfer
            </div>

            <div className="grid lg:grid-cols-4 gap-4 pt-5">
                <div className="col-span-1 col-start-2">
                    <TransferButton placeholder="Deposit" path="/transfer/deposit" />
                </div>
                <div className="col-span-1 col-start-3">
                    <TransferButton placeholder="Withdraw" path="/transfer/withdraw" />
                </div>
            </div>
            
            <div className="mt-8">{children}</div>
        </div>
    );
}
