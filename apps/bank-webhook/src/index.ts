import dotenv from "dotenv";

import express from "express"
import { prisma } from "@repo/db/client"
const app = express();
dotenv.config();
// This is the endpoint that HDFC bank will hit, when it pays some money
// To put transfer 
const port = process.env.PORT;
app.use(express.json())

app.get("/", async (req : any, res: any) => {
    res.status(200).json({
        msg : "Bank Webhook is Running"
    })
})

// console.log(port)
app.post("/hdfcWebhook", async (req : any, res: any) => {
    // *********************************************************
    // ****************(TODO)*****************
    // 1. Add zod validation here
    // 2. Check if this request actually came from hdfc bank, use a webHook secret
    // 3. Check if this onrampTxn is processing or Notification, and only once  
    const paymentInformation = {
        walletToken: req.body.token,
        // userId in Our DB 
        userId: req.body.user_indentifier,
        // amount that is needed to be credit to this userID
        amount: req.body.amount
    }
    // console.log(paymentInformation);
    // Update the userbalance in DB, add txn
    // Single request is more efficient 
    // console.log(paymentInformation.token);
    // console.log(paymentInformation.userId);
    // console.log(paymentInformation.amount);
    // Transactions => Either both update should happen or none can happen
    try {
        
        await prisma.$transaction([
            prisma.balance.update({
                where: {
                    userId: Number(paymentInformation.userId),
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            prisma.onRampTransaction.update({
                where: {
                    walletToken: paymentInformation.walletToken,
                    amount: Number(paymentInformation.amount),
                    status: "Processing"
                },
                data : {
                    // amount: Number(paymentInformation.amount),
                    status: "Success"
                }
            })
        ]);
            // To tell the HDFC server with status 200
            // ******** V.V.V.V. IMP ********
            // ************** SUPER IMP **************
            // if sent bad status code 411, then they will assume that not able to capture
            // and then they will refund this amount to user
        
            // BE VERY CAREFULL WHILE RETURNING STATUS CODE
            res.status(200).json({
                msg : "Captured"
            })
        }
    
        catch(e)
        {
            console.error(e);
            res.status(411).json({
                msg : "Error while processing webhook"
            })
        }
})  




app.post("/zenbankWebhook", async (req : any, res: any) => {
    // *********************************************************
    // ****************(TODO)*****************
    // 1. Add zod validation here
    // 2. Check if this request actually came from hdfc bank, use a webHook secret
    // 3. Check if this onrampTxn is processing or Notification, and only once  

    // const body = await req.json();
    const paymentInformation = {
        walletToken: req.body.walletToken,
        // userId in Our DB 
        userId: req.body.user_indentifier,
        // amount that is needed to be credit to this userID
        amount: req.body.amount,
        status: req.body.status
    }
    // console.log(paymentInformation);
    // Update the userbalance in DB, add txn
    // Single request is more efficient 
    // console.log(paymentInformation.token);
    // console.log(paymentInformation.userId);
    // console.log(paymentInformation.amount);

    // console.log(paymentInformation)
    // Transactions => Either both update should happen or none can happen
    try {
        let isDone = false;
        if(paymentInformation.status === "SUCCESS")
        {
            await prisma.$transaction(async (tx) => {

                await tx.balance.update({
                    where: {
                        userId: Number(paymentInformation.userId),
                    },
                    data: {
                        amount: {
                            increment: Number(paymentInformation.amount)
                        }
                    }
                }),

                await tx.onRampTransaction.update({
                    where: {
                        walletToken: paymentInformation.walletToken,
                        amount: Number(paymentInformation.amount),
                        status: {
                            in: ["Failure", "Processing"]
                        }
                    },
                    data : {
                        // amount: Number(paymentInformation.amount),
                        status: "Success"
                    }
                })
                isDone = true
            }
        );
        }
        else
        {
            await prisma.onRampTransaction.update({
                where: {
                    walletToken: paymentInformation.walletToken,
                    amount: Number(paymentInformation.amount),
                    status: { in: ["Processing", "Failure"] }
                },
                data : {
                    status: paymentInformation.status
                }
            })
            isDone = true
        }
            // To tell the HDFC server with status 200
            // ******** V.V.V.V. IMP ********
            // ************** SUPER IMP **************
            // if sent bad status code 411, then they will assume that not able to capture
            // and then they will refund this amount to user
        
            // BE VERY CAREFULL WHILE RETURNING STATUS CODE
            if(isDone)
            {
                res.status(200).json({
                    msg : "Captured"
                })
            }
            res.status(400).json({
                msg: "Error while processing webhook"
            })
        }
    
        catch(e)
        {
            res.status(411).json({
                msg : `Error while processing webhook`
            })
        }
})  


app.listen(port, () => {
    console.log(`Running on Port ${port}`)
});