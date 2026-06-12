"use client"
import { useRouter } from "next/navigation"
import React from "react";


export function ButtonDashboardActionCard({c, children, to, Num} : {c: React.ReactNode, children:React.ReactNode, to: string, Num: Number | string}){
    const router = useRouter();
    return (
        <button className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100 hover:border-indigo-600" onClick={() => {
            router.push(to);
        }}>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            {c} {children}
          </p>
          <h4 className="text-2xl font-bold mt-1 text-indigo-700">{Num.toString()}</h4>
        </button>
    )
}

