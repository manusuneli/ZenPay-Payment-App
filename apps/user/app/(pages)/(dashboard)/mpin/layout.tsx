import React, { JSX } from "react";
import { TransferButton } from "../../../../components/buttons/buttonsUsed";

export default function TransferLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">MPIN Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure or update your secure transaction authorization PIN</p>
                </div>
                
                {/* Segmented switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl w-full sm:max-w-[280px] border border-slate-200/50 dark:border-slate-700/30">
                    <TransferButton placeholder="Set" path="/mpin/set" />
                    <TransferButton placeholder="Update" path="/mpin/update" />
                </div>
            </div>
            
            <div className="mt-8">{children}</div>
        </div>
    );
}
