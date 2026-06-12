"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import LabelledInput from "@repo/ui/labelledinput";
import React, {useEffect, useState} from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputOTPGroup } from "../../inputotpgroup";
import { transferP2P } from "../../../app/lib/actions/p2ptransfer";
export default function SendCard({selectedNumber} : {selectedNumber: string})
{
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [value, setValue] = useState(0);
    const [showMpinBar, setShowMpinBar] = useState(false);
    const [Mpin, setMpin] = useState("");
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        setPhoneNumber(selectedNumber);
    }, [selectedNumber])
    // console.log(selectedNumber);
    async function validateMpin()
    {
        if(!session.data?.user)
        {
            return Response.json({
                msg: "User Not Loggedin!!"
            })
        }
        
        const res = await fetch("/api/mpin/validate", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Mpin: Mpin,
                email: session.data.user.email
            }),
        })
        return res.json();
        
    }
    // console.log(phoneNumber);
    return (
        <div className="h-max bg-white px-5 rounded-2xl">
            <Card title="Send">
                <div className="w-full max-w-full mt-8">
                    
                    <LabelledInput label="Number" placeholder="1231231231" value={phoneNumber} onChangeFunc={(val) => {
                        setPhoneNumber(val);
                    }}></LabelledInput>
                    <div className="mt-5"></div>
                    <LabelledInput label="Amount" placeholder="Amount" onChangeFunc={(val) => {
                        setValue(Number(val));
                    }}></LabelledInput>
                </div>
                
                <div className="flex justify-center mt-10 pb-8">
                    {!showMpinBar ? (<Button onClickFunc={async () => {
                        if(phoneNumber !== "" && value !== 0)
                        {
                            setShowMpinBar(true)
                        }
                        else 
                        {
                            alert("Invalid Details and Amount")
                        }
                        
                    }}>Next</Button>)
                : (
                    <div> 
                        <div className="font-sm font-bold flex justify-start py-1 border-b border-lg">Enter MPIN</div>
                            <div className="py-2 flex justify-center">
                                <InputOTPGroup type="password" onChangeFunc={(pin) => {
                                    setMpin(pin);
                                }}></InputOTPGroup>
                            </div>
                        <div className="flex justify-center py-2 pt-2">
                            <Button state={isLoading} onClickFunc={async () => {
                                setIsLoading(true)
                                const validateRes = await validateMpin();
                                // const validatestring = JSON.stringify(validateRes)
                                if(validateRes.msg === "Valid User")
                                {
                                    const res = await transferP2P(phoneNumber, Number(value) * 100);

                                    if(res?.msg == "User not Loggedin")
                                    {
                                        alert("User Not Logged in");
                                    }
                                    else if(res.msg == "Transfering to invalid user")
                                    {
                                        alert("Transfering to invalid user");
                                    }
                                    else if(res?.msg == "User not found")
                                    {
                                        alert("Receiver User not found");
                                    }
                                    else if(res.msg == "Insufficient funds")
                                    {
                                        alert("Insufficient funds");
                                    }
                                    else if(res.msg == "Transaction Success")
                                    {
                                        alert("Transaction Success");
                                        router.push("/transactions/p2p");
                                    }
                                    else if(res.msg == "Insufficient Funds")
                                    {
                                        alert("Insufficient Funds")
                                    }
                                    else if(res.msg == "Invalid Amount")
                                    {
                                        alert("Invalid Amount")
                                    }
                                    else{
                                        alert("Error while p2p");
                                    }
                                }
                                else 
                                {
                                    alert("Invalid MPIN")
                                }
                                setIsLoading(false)
                            }}>{isLoading ? 
                                <div role="status">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>:"Transfer"}</Button>
                        </div>

                    </div>)}
                </div> 
            </Card>
        </div>
    )
}