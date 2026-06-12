"use server";

import { redisclient } from "../../../redis";


export async function cacheInRedis(userData: {
  userId: string,
  name: string,
  phoneNumber: string,
  email: string,
  accountNumber: string,
  ifsc: string,
  bank: string,
  token: string,
  provider: string
}) {
  if (!redisclient.isOpen) 
  {
    await redisclient.connect();
  }
  await redisclient.set(
    `link_auth_token: ${userData.token}`,
    JSON.stringify(userData),
    { EX: 300 }
  );
}
