// app/api/auth/otp/send-otp/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@repo/db/client";
import { signIn } from "next-auth/react";

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  { lazyLoading: true }
);

export async function POST(req: Request) {
    const body = await req.json();
    const {email, Name, contact, password} = body
    // Not to use signin of nextauth to server 
    try{
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            },
        })
        
        if(existingUser)
        {
            return NextResponse.json( {
                msg: "User Already have an Account!!"
            },
            {
                status:500  
            })
        }
        else 
        {
            return NextResponse.json( {
                msg: "User Does not have an Account!!"
            },
            {
                status:200  
            })
        }
    }
    catch(e)
    {
        return NextResponse.json( {
            error: "Something wrong happened!!"
        },
        {
            status: 500
        })
    }
    
    
}
