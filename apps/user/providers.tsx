"use client"

import React from "react"
import { RecoilRoot } from "recoil"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./providers/ThemeProvider"
import { ToastProvider } from "./providers/ToastProvider"

export default function Providers({children} : {children:React.ReactNode}) {
    return (
        <RecoilRoot> 
            <SessionProvider>
                <ThemeProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </ThemeProvider>
            </SessionProvider>
        </RecoilRoot>
    )
}