"use client"
import { Button } from "@repo/ui/button";
import { redirect, usePathname, useRouter } from "next/navigation"
import React, { useState } from "react";


export function ButtonSeeAllCard({link, children} : {link:string, children: React.ReactNode})
{
    const router = useRouter();
    return (
        <div>
            <button className="flex hover:underline py-1" onClick={() => {
                router.push(link)
            }}>
                {children}
            </button>
        </div>
    )
}

export function TransferButton({placeholder, path}: {
    placeholder: string,
    path: string
})
{
    const router = useRouter();
    const currpath = usePathname();
    const selected = currpath === path;

    return (
      <button
        onClick={() => {
            router.push(path);
        }}
        suppressHydrationWarning={true}
        className={`flex-1 text-center font-bold text-sm py-2 px-6 rounded-xl transition duration-200 ${
          selected
            ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        {placeholder}
      </button>
    );
}

export function ButtonDashboardtoRedirect({children, to} : {children: React.ReactNode, to: string})
{
    const router = useRouter();
    return (
        <button onClick={() => {
            router.push(to);
        }} className="flex-1 bg-white hover:bg-purple-50 text-indigo-700 font-semibold rounded-lg py-2 shadow-sm">
            {children}
        </button>
    )
}

