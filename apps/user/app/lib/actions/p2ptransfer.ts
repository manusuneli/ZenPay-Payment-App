"use server"
import { prisma } from "@repo/db/client";
import { NEXT_AUTH } from "../auth";
import { getServerSession } from "next-auth";


export async function transferP2P(to : string, amount : number)
{

    const session = await getServerSession(NEXT_AUTH);
    const fromUser = session?.user;
    const fromId = session?.user?.id;
    if(!fromId)
    {
        return {
            msg : "User not Loggedin"
        }
    }

    // details of to user    
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    const fromUserDetails = await prisma.user.findFirst({
        where: {
            id: Number(fromId)
        }
    })
    if(!toUser)
    {
        return {
            msg: "User not found",
        }
    }

    // console.log(fromUser.number);
    if(fromUserDetails && (fromUserDetails.number === to))
    {
        return {
            msg: "Transfering to invalid user"
        }
    }
        
    if(amount <= 0)
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

        const existingContactsRelation1 = await prisma.contact.findMany({
            where: {
                userId: Number(fromId),
                contactId: toUser.id
            }
        })
        const existingContactsRelation2 = await prisma.contact.findMany({
            where: {
                contactId: Number(fromId),
                userId: toUser.id
            }
        })
        // console.log(existingContactsRelation1);
        // console.log(existingContactsRelation2);
        
        try {
            await prisma.$transaction(async (tx) => {
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
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromId)} FOR UPDATE`
            const fromBalance = await tx.balance.findUnique({
                where: {
                    userId: Number(fromId)
                }
            });
            // console.log("Before sleep");
            // await new Promise(r => setTimeout(r, 4000));
            // console.log("After sleep");
            // All request were allowed to debit money from 1 account and all were allowed to credit money to Another account
            // This led to 
            // 1st make amount -ve in senders account 
            if(!fromBalance || fromBalance.amount < amount)
            {
                throw new Error("Insufficient funds");
            }
            
            await tx.balance.update({
                where: {
                    userId: Number(fromId)
                },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            })
            
            const toUserDetails = await tx.balance.update({
                where: {
                    userId: toUser.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                },
                select: {
                    user: true
                }
            })
            
            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(fromId),
                    amount: amount,
                    timestamp: new Date(),
                    toUserId: Number(toUser.id),
                    toUserName: toUserDetails.user.name || "",
                    paymentModeP2P: "paid"
                }
            })

            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(toUser.id),
                    amount: amount,
                    timestamp: new Date(),
                    toUserId: Number(fromId),
                    toUserName: fromUserDetails?.name || "",
                    paymentModeP2P: "received"
                }
            })

            await tx.notification.create({
                data: {
                    userId: toUser.id,
                    title: `Received ₹${(amount / 100).toFixed(2)} from ${fromUserDetails?.name ?? "Someone"}`,
                    message: `You have received a peer-to-peer transfer of ₹${(amount / 100).toFixed(2)}.`,
                    type: "PAYMENT",
                    action: "VIEW",
                    createdAt: new Date()
                }
            });

            if(!existingContactsRelation1[0]?.id)
            {
                const entry1 = await tx.contact.create({
                    data: {
                        user: {
                            connect: {id : Number(fromId)}
                        },
                        contact: {
                            connect: {id : toUser.id}
                        }
                    }
                })
            }
            if(!existingContactsRelation2[0]?.id)
            {
                const entry2 = await tx.contact.create({
                    data: {
                        user: {
                            connect: {id : toUser.id}
                        },
                        contact: {
                            connect: {id : Number(fromId)}
                        }
                    }
                })
            }
            
        })
        
        return {
            msg : "Transaction Success"
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
            
            msg : "Error while p2p",
        }
    }
    
}