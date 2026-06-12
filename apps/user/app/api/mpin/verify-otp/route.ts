import { NextResponse } from "next/server";
import { connectRedis, redisclient } from "../../../../redis";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, otp } = body;

  try {
    await connectRedis();

    const redisOTP = await redisclient.get(email);

    if (otp === redisOTP) {
      await redisclient.del(email);
      return NextResponse.json({
        msg: `OTP Verified Successfully!!`
      });
    }

    return NextResponse.json(
      { msg: "Invalid OTP" },
      { status: 400 }
    );

  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      { msg: "Something went wrong!" },
      { status: 500 }
    );
  }
}
