import { NextResponse } from "next/server";
import { prisma } from "@repo/db/client";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, name, email, phone, accountNumber, ifsc } = body;

  if (!userId || !name || !email || !phone || !accountNumber || !ifsc) {
    return NextResponse.json({ msg: "Missing data." }, { status: 400 });
  }

  try {
    // Get user along with their linked accounts
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
        name,
        email,
        number: phone
      },
      select: {
        accounts: true
      }
    });

    if (!user) {
      // console.log("HERE Ji")
      return NextResponse.json(
        { msg: "Invalid Details" },
        { status: 400 }
      );
    }

    // Check if this account is already linked
    const alreadyLinked = user.accounts.some( (acc) =>
    {
      acc.accountNumber === accountNumber && acc.ifsc === ifsc
    });

    if (alreadyLinked) {
      return NextResponse.json(
        { msg: "Account already linked." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { msg: "Valid user, account not yet linked." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Invalid Details:", error);
    return NextResponse.json(
      { msg: "Something went wrong!" },
      { status: 500 }
    );
  }
}
