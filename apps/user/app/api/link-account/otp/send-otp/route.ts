import { prisma } from "@repo/db/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectRedis, redisclient } from "../../../../../redis";

const generateOTP = (): string => {
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};

const sendVerificationEmail = async (
  email: string,
  otp: string,
  username: string
): Promise<string> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `ZenPay Payments <${process.env.EMAIL_ID}>`,
      to: email,
      subject: "Verification Code to Link Account",
      text: `Hello ${username},
Your one-time ZenPay code is [${otp}].

Please enter this to securely complete your Account Link.

For your safety, never share this code.
Thank you for trusting ZenPay — seamless payments, made simple.

ZenPay | Safe. Fast. Effortless.`,
    });

    await connectRedis();
    await redisclient.set(email, otp, {
      EX: 300, // expire OTP in 5 minutes
    });

    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending verification email");
  }
};

export async function POST(req: Request) {
  try {
    const otp = generateOTP();
    const { email, username } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    await sendVerificationEmail(email, otp, username);
    return NextResponse.json(
      {
        message: "Verification code has been sent to your email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
