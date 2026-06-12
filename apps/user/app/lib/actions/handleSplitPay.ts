"use server"
import { prisma } from "@repo/db/client";
import { NEXT_AUTH } from "../auth";
import { getServerSession } from "next-auth";

interface Props {
  token: string; 
  splitId: number; 
  splitBillId: number 
};

export async function handleSplitPay(mpin : string, balance : number, b: Props)
{
    const session = await getServerSession(NEXT_AUTH);
    if(!session?.user?.id)
    {
        return {
            redirect : "/auth/signin"
        }
    }
    const userId = Number(session?.user?.id);
    const createdUser = await prisma.splitBill.findUnique({
        where: {
            id: b.splitBillId,
        },
        select: {
            createdByUserId: true,
            splits: {
                where: {
                    userId: userId,
                    id: b.splitId,
                    token: b.token,
                    status: "PROCESSING" as const,
                },
                select: {
                    amount: true,
                    phone: true,
                    user: {
                        select:{
                            name: true
                        }
                    },
                    notifications: {
                        where: {
                            splitId: b.splitId,
                        },
                        select: {
                            message: true
                        }
                    }
                }
            },
            createdByUser: {
                select: {
                    number: true,
                    id: true,
                    name: true
                }
            },
        }
    })
    if(!createdUser)
    {
        return {
            msg: "Invalid Credentails"
        }
    }
    const createrUserId = createdUser?.createdByUser.id;
    if(createdUser && (userId === createdUser.createdByUserId))
    {
        return {
            msg: "Transfering to invalid user"
        }
    }

    if(!createdUser.splits[0] || !createdUser.splits[0].amount || !createdUser.splits[0].phone)
    {
        return {
            msg: "No split Exist"
        }
    }
        
    if(createdUser.splits[0] && createdUser.splits[0]?.amount <= 0)
    {
        return {
            msg: "Invalid Amount"
        }
    }
            
        // HERE ************************ V.V.V.V. IMP ************************
        
        // ***********************************************************************
        // *****************************VERY BIG BUG *****************************
        // What if any person sends a lot of request at a same time 
        // 1st one will stuck in Async, then second comes until 1st is getting processed 
        // Then similarly all clear the checks and got stuck at async then all get pass checks 
        // And then all succeded
        // THIS IS PROBLEM 
        // Even if user has 200 rupees will be able to share 400 rupees 
        // *************************** IT IS NOT SAFE ***************************
        // TEST IT BY 2 TABS

        // console.log(fromId);
        // console.log("From here to User");
        // console.log(toUser);
        // console.log("HERE")
        const PayerUserNumber = createdUser.splits[0]?.phone;
        const CreaterUserNumber = createdUser.createdByUser.number;
        const PayerUserName = createdUser.splits[0].user.name;
        // console.log(existingContactsRelation1);
        // console.log(existingContactsRelation2);
        try {
            await prisma.$transaction(async (tx) => {
            const amount = (createdUser.splits[0]?.amount || 0);
            // make sure user has that much money
            // B.E. should block me
            // this could take 1 sec or 20 sec
            
            // THIS IS DONE BY ****** DATABASE LOCKING ******, => at a TIME at that row ONLY one has access to write or read into the DB
            // Until anything accessed, THIS ROW NEEDS to be locked
            // *****  BALANCE PROTECTION *****
            // *********************
            // In MongoDB, if doing TX, while some request are Happening, if any row changed by some another person, 
            // MONGODB reverts the TX 
            // PG doesn't do this
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(PayerUserNumber)} FOR UPDATE`
            const PayerUserBalance = await tx.balance.findUnique({
                where: {
                    userId: Number(userId)
                }
            });
            console.log(PayerUserBalance?.amount || 0);
            // console.log("Before sleep");
            // await new Promise(r => setTimeout(r, 4000));
            // console.log("After sleep");
            // All request were allowed to debit money from 1 account and all were allowed to credit money to Another account
            // This led to 
            // 1st make amount -ve in senders account 
            // console.log(amount);
            // console.log(PayerUserBalance?.amount);
            if(amount > (PayerUserBalance?.amount || 0))
            {
                throw new Error("Insufficient funds");
            }
            
            await tx.balance.update({
                where: {
                    userId: Number(userId)
                },
                data: {
                    amount: {
                        decrement: Number(amount)
                    }
                }
            })
            
            const toUserDetails = await tx.balance.update({
                where: {
                    userId: Number(createrUserId)
                },
                data: {
                    amount: {
                        increment: Number(amount)
                    }
                },
                select: {
                    user: true
                }
            })
            // splitEntryUpdate
            
            await tx.splitEntry.update({
                where: {
                    id: b.splitId,
                    token: b.token,
                    splitBillId: b.splitBillId,
                    status: "PROCESSING"
                },
                data: {
                    status: "SUCCESS",
                    paidAt: new Date(Date.now())
                }
            })

            // Notification
            await tx.notification.create({
                data: {
                    userId: Number(createrUserId),
                    title: `Received Split Amount of ${amount/100} by ${PayerUserName}`,
                    message: createdUser.splits[0]?.notifications[0]?.message || "",
                    type: "SPLIT",
                    action: "VIEW",
                    splitId: b.splitId
                }
            })
            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(userId),
                    amount: amount,
                    timestamp: new Date(),
                    toUserId: Number(createrUserId),
                    toUserName: createdUser.createdByUser.name || "",
                    paymentModeP2P: "paid",
                    type: "SPLIT"
                }
            })

            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(createrUserId),
                    amount: amount,
                    timestamp: new Date(),
                    toUserId: Number(userId),
                    toUserName: PayerUserName || "",
                    paymentModeP2P: "received",
                    type: "SPLIT"
                }
            })
        })
        
        return {
            msg : "Payment Success"
        }
        
    }
    catch(e) {
        console.log(e);
        if(e == "Error: Insufficient funds")
        {
            return {
                msg: "Insufficient Funds"
            }
        }
        return {
            
            msg : "Error while Split Pay",
        }
    }
    
}