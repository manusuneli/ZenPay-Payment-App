"use server";
import { prisma } from "@repo/db/client";
import { redisclient } from "../../../redis";

export async function updateAccessToken(
  link_auth_token: string,
  done_token: string,
  access_token: string
) {
  try {

    if(!redisclient.isOpen)
    {
        await redisclient.connect();
    }
    const linkDataString = await redisclient.get(`link_auth_token: ${link_auth_token}`);
        if (!linkDataString) {
            return {
                msg: "Invalid or expired link_auth_token."
            }
        }
    const linkData = JSON.parse(linkDataString);
    const { userId, email, phone, accountNumber, ifsc } = linkData;
    
    const AlreadyLinkedAccount = await prisma.account.findUnique({
        where:{ 
            accountNumber: accountNumber,
            ifsc: ifsc
        }
    })

    if(AlreadyLinkedAccount)
    {
        return {msg : "This account is already Linked!!"}

    }
    await prisma.$transaction(async (tx) => {
      await tx.account.create({
          data: {
            userId: Number(userId),
            accountNumber: accountNumber,
            accessToken: access_token,
            ifsc: ifsc
          }
      })

      await redisclient.del(`link_auth_token:${link_auth_token}`);
      await redisclient.del(`Done_token:${done_token}`);
    })
    
    return { msg: "Account linked successfully!" };
  } catch (e) {
    console.error("Error in linking:", e);
    return { msg: "Something went wrong." };
  }
}
