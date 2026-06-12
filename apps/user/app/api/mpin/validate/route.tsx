import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session) {
    return NextResponse.json({ msg: "User not logged in!" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { Mpin, email } = body;
    // console.log(Mpin, email)
    if (!Mpin || !email) {
      // console.log(Mpin, email)
      return NextResponse.json({ msg: "Missing data." }, { status: 400 });
    }

    const userRecord = await prisma.user.findFirst({
      where: { email },
      select: { MPIN: true }
    });

    if (!userRecord?.MPIN) {
      return NextResponse.json({ msg: "MPIN not set for this user" }, { status: 400 });
    }

    const isValid = userRecord.MPIN && Mpin && await bcrypt.compare(Mpin, userRecord.MPIN);

    if (isValid) {
      return NextResponse.json({ msg: "Valid User" });
    } else {
      return NextResponse.json({ msg: "Invalid MPIN" }, { status: 400 });
    }
  } catch (e) {
    console.error("Error validating MPIN:", e);
    return NextResponse.json({ msg: "Something went wrong." }, { status: 500 });
  }
}
