"use server"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import { prisma } from "@repo/db/client";
import { redisclient } from "../../../redis";

export async function getDetailsByLinkToken(link_auth_token: string) {
  try {
    const session = await getServerSession(NEXT_AUTH);
    const userId = session?.user?.id;


    if (userId) {
      if (!redisclient.isOpen) {
        await redisclient.connect();
        }
    
        const linkDataString = await redisclient.get(`link_auth_token:${link_auth_token}`);
        if (!linkDataString) {
            return {
                msg: "Invalid or expired link_auth_token."
            }
        }
        const linkData = JSON.parse(linkDataString);
        const { userId, email, phone, accountNumber, ifsc } = linkData;
        
        return {
            msg: "valid",
            userId: userId,
            email: email,
            phone: phone,
            accountNumber: accountNumber,
            ifsc: ifsc
        }
    }
    return { 
        error: "Unauthorized"
    }
  } catch (e) {
    console.error("Error Occurred in Deposit", e);
    return { 
        error: "Internal Server Error" 
    };
  }
}
