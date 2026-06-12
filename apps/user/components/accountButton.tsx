"use client"
import { useRouter } from "next/navigation";
import React from "react"

interface AccountButtonInput {
    children: React.ReactNode,
    className: string,
    to: string;
}

export function AccountButton({children, className, to} : AccountButtonInput)
{
    const router = useRouter();
    return (
        <button onClick={() => {
            router.push(to);
        }} className={className}>
            {children}
        </button>
    )
}