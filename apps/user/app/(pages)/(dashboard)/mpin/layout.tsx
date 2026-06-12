import React, { JSX } from "react";
import { TransferButton } from "../../../../components/buttons/buttonsUsed";

export default function TransferLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div className="max-w-screen">
            <h1 className="mx-4 mt-20 py-1 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
                MPIN Settings
            </h1>

            <div className="grid lg:grid-cols-4 gap-4 pt-5">
                <div className="col-span-1 col-start-2">
                    <TransferButton placeholder="SET" path="/mpin/set" />
                </div>
                <div className="col-span-1 col-start-3">
                    <TransferButton placeholder="UPDATE" path="/mpin/update" />
                </div>
            </div>
            
            <div className="my-8">{children}</div>
        </div>
    );
}
