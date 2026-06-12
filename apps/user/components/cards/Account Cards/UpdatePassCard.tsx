"use client";

import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LabelledInputAuth from "@repo/ui/labelledinputauth";
import { InputOTPGroup } from "../../inputotpgroup";

interface UpdatePasswordInput {
  title: string;
}

export function UpdatePassword({ title }: UpdatePasswordInput) {
    const router = useRouter();
    const [timerRunning, setTimerRunning] = useState(false);
    const [otp, setOtp] = useState(false);
    const [receivedOtpCode, setReceivedOtpCode] = useState("");
    const [resendClicked, setResendClicked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const session = useSession();
    const [error, setError] = useState("");
    const [firstTime, setFirstTime] = useState(true);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [confirmedpassword, setConfirmedpassword] = useState("");
    const [OTPresponse, setOTPresponse] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOtp, setIsLoadingOtp] = useState(false)

    const startTimer = () => {
        setTimeLeft(60);
        setTimerRunning(true);
    };

  
  const handleVerify = async () => {
    // if (!session.data?.user) 
    // {
    //     setError("User not logged in!")
    //     return console.error("User not logged in!");
    // }
    const res = await fetch("/api/update/otp/verify-otp",
      {
        method: "POST",
        headers: {
           'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: receivedOtpCode
        })
      }  
    );

    if(res.status === 200)
    {
      setOTPresponse("OTP Verified!!");
    }
    else if(res.status === 400)
    {
      setOTPresponse("Incorrect OTP. Please try again.");
    }
    return res.status;
  }

  const resendOTP = async () => {
    setTimerRunning(false);
    startTimer();
    setResendClicked(true);
    await handleSendOtp();
  };

  useEffect(() => {
    let timer: any;
    if (timerRunning) {
      timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft((prevTime) => prevTime - 1);
        } else {
          setTimerRunning(false);
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerRunning]);


  const handleSendOtp = async () => {

    // if (!session.data?.user) 
    // {
    //     setError("User not logged in!")
    //     return console.error("User not logged in!");
    // }
    startTimer();
    setResendClicked(true);
    const res = await fetch("/api/update/otp/send-otp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: session.data?.user?.name,
        phonenumber: contact
      }),
    });
    if (res.status === 200) {
      setOtp(true);
    }
    else if(res.status === 400)
    { 
      alert("Please check the Info provided is correct.")
    } else {
      alert(`Something went Wrong.Please Try again!!`);
      setOtp(false);
    }
  };

  async function setPasswordtoDB() {

    // if (!session.data?.user) 
    // {
    //     setError("User not logged in!")
    //     return console.error("User not logged in!");
    // }
    const res = await fetch(`/api/update/password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        phonenumber: contact
      }),
    });
    if (res.ok) {
      alert("Password Updated Successfully!!")
      router.push("/profile");
    } 
    else 
    {
      alert("Incorrect Information!!");
    }
  }

  
  return (
    <div className="min-h-fit mx-5">
      <div className="pt-2"></div>
      <Card title={title}>
        <div className="font-2xl font-semibold px-3 py-3">
        A safer wallet starts with a smarter password—refresh now!
        </div>
        {error && <div className="font-sm text-red-500 font-semibold flex justify-center">{error}</div>}
        {password && email && contact && confirmedpassword && password !== confirmedpassword && (
          <div className="pt-1 font-semibold flex justify-center font-xl text-red-500 font-sm">
            Incorrect Password
          </div>
        )}
        <div className="py-6">
          <LabelledInputAuth label="Enter Email" placeholder="johndoe2@gmail.com" type="email" onChangeFunc={(e) => {
            setEmail(e);
          }}/>
        </div>
        <div className="py-6">
          <LabelledInputAuth label="Enter Phone Number" placeholder="1231231231" type="tel" onChangeFunc={(e) => {
            setContact(e);
          }}/>
        </div>
        <div className="py-6">
          <LabelledInputAuth label="Enter Password (min. 6 char)" placeholder="1@3$5^" type="password" onChangeFunc={(e) => {
            setPassword(e);
          }}/>
        </div>
        
        <div className="py-6">
          <LabelledInputAuth label="Confirm Password (min. 6 char)" placeholder="1@3$5^" type="password" onChangeFunc={(e) => {
            setConfirmedpassword(e);
          }}/>
        </div>
        <div className="flex justify-center py-3">
          { !otp &&
            <Button state={isLoadingOtp}
              onClickFunc={async () => {
                setIsLoadingOtp(true)
                if (password && contact && email && confirmedpassword && password === confirmedpassword) {
                  setError("");
                  await handleSendOtp();
                  setFirstTime(false);
                }
                else
                {
                    if(session.data?.user)
                    {
                      setError("Invalid credentials")
                    }
                    else 
                    {
                      setError("Enter Valid Datails!")
                    }
                }
                setIsLoadingOtp(false)
              }}
            >
              {isLoadingOtp ? <div role="status">
             <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
             </svg>
             <span className="sr-only">Loading...</span>
         </div>: "Next"}
            </Button>
          }
        </div>
        <div>
          { otp && password && contact && email &&
            confirmedpassword &&
            password === confirmedpassword && (
              <div className="text-center text-green-500 text-base mt-1 font-semibold">
                OTP sent successfully on your email. Please enter OTP below.
              </div>
            )}
          { otp && password && contact && email &&
            confirmedpassword &&
            password === confirmedpassword && (
              <div className="space-y-2 w-full flex flex-col items-center justify-center my-2">
                <InputOTPGroup
                  type="otp"
                  onChangeFunc={(e: string) => {
                    setReceivedOtpCode(e);
                  }}
                />
                <div>
                  {resendClicked && timeLeft > 0 ? (
                    <p className="text-sm">
                      Resend OTP available in{" "}
                      <span className="text-blue-500">
                        {timeLeft > 0 ? `${timeLeft}` : ""}
                      </span>
                    </p>
                  ) : (
                    <button onClick={resendOTP} className="text-blue-500">
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}
        </div>
        {OTPresponse === "OTP Verified!!" ? (
            <p className="text-green-500 text-sm text-center mt-2">
            {OTPresponse}
            </p>
        ) : 
        <p className="text-red-500 text-sm text-center mt-2">
            {OTPresponse}
        </p>}
          { otp && password && contact && email &&
            confirmedpassword &&
            password === confirmedpassword ? 
            <button disabled={isLoading}
              onClick={async () => {
                
                if(password && contact && email && confirmedpassword && password === confirmedpassword && session)
                {
                    setIsLoading(true)
                    const res = await handleVerify();

                    if(res === 200)
                    {
                        await setPasswordtoDB();
                        setOTPresponse("OTP Verified!!")
                    }
                    else if(res === 400)
                    {
                        setOTPresponse("Incorrect OTP. Please try again.")
                    }
                    else 
                    {
                        setOTPresponse("Something went Wrong. Please try again.")
                    }
                    setIsLoading(false)
                }
            }}
              className="w-full mt-4 bg-green-500 hover:bg-green-400 rounded-lg h-10 my-6"
            >
             {isLoading ? 
             <div role="status">
             <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
             </svg>
             <span className="sr-only">Loading...</span>
         </div>: "Update password"}
            </button> : ""
        }
      </Card>
    </div>
  );
}
