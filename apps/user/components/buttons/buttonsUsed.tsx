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

    return  <div>
        <button onClick={() => {
            router.push(path);
        }} suppressHydrationWarning={true} className={`text-black font-semibold h-10 w-max px-10 rounded-2xl ${selected ? "bg-white" : ""} hover:text-gray-600`}>{placeholder}</button>
    </div>
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

