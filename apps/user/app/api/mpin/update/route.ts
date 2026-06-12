import { NextResponse } from "next/server";
import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../../lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(NEXT_AUTH);
    if(!session)
    {
        return NextResponse.json({
            msg : "User not Loggedin!"
        },
        {
            status: 404
        })
    }


    try {
        const { email, mpin } = await request.json();
        const hashedMpin = await bcrypt.hash(mpin, 10);
        const user = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                MPIN: hashedMpin,
            },
        });

        return NextResponse.json({ message: "MPIN updated successfully", user });
    } catch (error: any) {
        return NextResponse.json(
          { 
            message: "Error occurred during MPIN update", 
            error: error?.message || String(error) 
          },
          { status: 500 }
        );
      }
      
}

    
