import express from "express";
import { prisma } from "@repo/db/client";
import { createClient, RESP_TYPES } from "redis";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;
const MAX_RETRIES = 3;
const REDIS_URL = process.env.REDIS_URL;
const redisclient = createClient({
  url: REDIS_URL,
  // socket: {
  //   tls: true,
  //   rejectUnauthorized: false,
  //   host: "proper-tiger-40609.upstash.io",
  // }
});


const queueRedisClient = createClient({
  url: REDIS_URL,
  // socket: {
  //   tls: true,
  //   rejectUnauthorized: false,
  //   host: "proper-tiger-40609.upstash.io",
  // },
});

redisclient.on("error", (err) => console.error("Redis Client Error", err));
queueRedisClient.on("error", (err) => console.error("Queue Redis Client Error", err));



interface WithdrawPayload {
  withdrawToken: string;
  userId: number;
  amount: number;
  toBank: string;
  selectedAccountNumber: string;
  accessToken: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function handleWithdraw(txn: WithdrawPayload, txnKey: string): Promise<"Success" | "Failure"> {
  try {
    await prisma.offRampTransaction.updateMany({
      where: {
        withdrawToken: txn.withdrawToken,
        status: {
          in: ["Failure", "Processing"]
        },
        amount: txn.amount
      },
      data: {
        status: "Processing"
      }
    });
    // console.log("HERE")
    const res = await fetch(`${process.env.ZENPAY_WEBHOOK_URL}/zenpayWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        withdrawToken: txn.withdrawToken,
        amount: txn.amount,
        accessToken: txn.accessToken,
        provider: txn.toBank
      })
    });

    const resBody = await res.json();
    // console.log(resBody)
    const isSuccess = res.status === 200 && resBody?.msg === "Captured";
    const status = isSuccess ? "Success" : "Failure";

    await prisma.$transaction(async (tx) => {
      if (isSuccess) {
        await tx.balance.update({
          where: { userId: txn.userId },
          data: { amount: { decrement: txn.amount } }
        });
      }

      await tx.offRampTransaction.updateMany({
        where: {
          withdrawToken: txn.withdrawToken,
          status: { in: ["Processing", "Failure"] }
        },
        data: { status }
      });
    });

    if (isSuccess) {
      await redisclient.del(txnKey);
    } else {
      const retryKey = `withdrawRetry:${txn.withdrawToken}`;
      const retryCount = parseInt((await redisclient.get(retryKey)) || "0");
      if (retryCount < MAX_RETRIES) {
        await redisclient.set(retryKey, retryCount + 1, { EX: 3600 });
        // await redisclient.RPUSH("withdrawUserQueue:transactions", txn.withdrawToken);
      } else {
        console.warn(`[RETRY_LIMIT] WithdrawToken ${txn.withdrawToken} reached max retries`);
      }
    }

    return status;
  } catch (error) {
    console.error("[WITHDRAW_ERROR]", error);

    const retryKey = `withdrawRetry:${txn.withdrawToken}`;
    const retryCount = parseInt((await redisclient.get(retryKey)) || "0");
    if (retryCount < MAX_RETRIES) {
      await redisclient.set(retryKey, retryCount + 1, { EX: 3600 });
      // await redisclient.RPUSH("withdrawUserQueue:transactions", txn.withdrawToken);
    } 
    else {
      await prisma.offRampTransaction.updateMany({
        where: {
          withdrawToken: txn.withdrawToken,
          status: { in: ["Processing", "Failure"] }
        },
        data: { 
          status: "Failure"
        }
      });
      console.warn(`[RETRY_LIMIT] WithdrawToken ${txn.withdrawToken} reached max retries`);
    }

    return "Failure";
  }
}

async function processWithdrawForever() {
  while (true) {
    try {

      if (!redisclient.isOpen) await redisclient.connect();
      if (!queueRedisClient.isOpen) await queueRedisClient.connect();

      const result = await queueRedisClient.blPop(["withdrawUserQueue:transactions"], 0);
      
      // console.log(result);
      if (!result) {
        await sleep(100);
        continue;
      }
      const { element: withdrawToken } = result;
      // console.log(withdrawToken)
      // const { element: withdrawToken } = result;
      // console.log("Processing:",withdrawToken);

      const txnKey = `withdraw-txn:${withdrawToken}`;
      // console.log(txnKey)
      const txnData = await redisclient.get(txnKey);
      // console.log(txnData);
      if (!txnData) {
        console.warn(`[WARN] Transaction data not found for token: ${withdrawToken}`);
        continue;
      }

      const txn: WithdrawPayload = JSON.parse(txnData);
      const userId = txn.userId.toString();
      const lockKey = `withdrawUserLock:${userId}`;

      const lock = await redisclient.set(lockKey, "locked", { NX: true, EX: 10 });

      if (!lock) {
        console.log(`[LOCK] User ${userId} is already being processed. Re-queuing...`);
        // await redisclient.rPush("withdrawUserQueue:transactions", withdrawToken);
        await sleep(100);
        continue;
      }

      try {
        const result = await handleWithdraw(txn, txnKey);

        if (result !== "Success") {
          await redisclient.rPush("withdrawUserQueue:transactions", withdrawToken);
          console.error(`[RETRY] Withdraw failed for ${withdrawToken}, re-queuing...`);
        }
        
      }
      finally {
        await redisclient.del(lockKey);
      }

    } catch (err) {
      console.error(`[FATAL LOOP ERROR]`, err);
      await sleep(1000);
    }
  }

}

app.get("/", (_, res) => {res.send("Withdraw Worker is running")});

app.get("/health", async (_, res) => {
  try {
    await redisclient.ping();
    res.send("OK");
  } catch {
    res.status(500).send("Redis unavailable");
  }
});

app.listen(port, () => {
  processWithdrawForever();
});