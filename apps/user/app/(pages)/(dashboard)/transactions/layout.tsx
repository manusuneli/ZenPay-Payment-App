import React, { JSX } from "react";
import { TransferButton } from "../../../../components/buttons/buttonsUsed";


export default function({children} : {children: React.ReactNode}) : JSX.Element
{
    return (  <div className="min-h-screen">
                <div className="px-1 mt-20 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-10">
                    Transactions
                </div>
                    {/* add select */}
                <div className="self-center text-center w-full">
                    <div className="lg:grid grid-cols-5 gap-20">
                        <div className="col-span-1 col-start-2">
                            <TransferButton placeholder="Deposit" path="/transactions/deposit" />
                        </div>
                        <div className="col-span-1 col-start-3">
                            <TransferButton placeholder="Withdraw" path="/transactions/withdraw" />
                        </div>
                        <div className="col-span-1 col-start-4">
                            <TransferButton placeholder="P2P" path="/transactions/p2p" />
                        </div>
                    </div>
                    
                </div>
                <div className="w-full flex justify-center">
                    {children}
                </div>
        </div>
        
    )
}