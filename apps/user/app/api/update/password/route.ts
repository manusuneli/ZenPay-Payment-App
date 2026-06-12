// app/api/auth/otp/send-otp/route.ts
import { prisma } from "@repo/db/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const { email, password, phonenumber } = await req.json();
    // console.log("Email:", email);

    const existingUser = await prisma.user.findUnique({
      where: { 
        email: email,
        number: phonenumber
       },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exists"},
        { status: 400 }
      );
    } else {
      
        try {
            const hashedPass = await bcrypt.hash(password, 10);
            const res = await prisma.user.update({
                where: {
                  email: email,
                  number: phonenumber
                },
                data: {
                    password: hashedPass
                }
            })
            return NextResponse.json({
                message: "Verification code has been sent to your email"
            },{
                status:200
            });
        }
        catch(e)
        {
            console.error(e);
            return NextResponse.json(
            { error: "Something wrong Occured during Updating Password!"},
            { status: 500 }
            );
        }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
