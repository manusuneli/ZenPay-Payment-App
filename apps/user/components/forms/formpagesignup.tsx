"use client"
import React, { useEffect, useState } from "react";
import LabelledInputAuth from "@repo/ui/labelledinputauth"
import { useRouter } from "next/navigation";
import {signIn} from "next-auth/react"
import {z} from "zod";
import { prisma } from "@repo/db/client";
import { InputOTPGroup } from "../inputotpgroup";


const nextReqSchema = z.object({
  contact: z.string().length(10),
  Name: z.string().min(1),
  email: z.string().email()
})


const loginReqSchema = z.object({
  contact: z.string().length(10),
  Name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).max(14),
  receivedOtpCode: z.string().length(4)
})

// https://ethanmick.com/build-a-custom-login-page-with-next-js-tailwind-css-and-next-auth/
// https://www.ramielcreations.com/nexth-auth-magic-code
// https://www.youtube.com/watch?v=bicCg4GxOP8&ab_channel=CandDev

// Twillo
// https://medium.com/globant/twilio-otp-authentication-12002a139e38
export default function FormPageSignup() {
  // const [error, setError] = useState<string | null>(null);
  // const [searchParams, setSearchParams] = useSearchParams();

  // const [showOTPbar, setShowOTPbar] = useState(false);
  // const [sendOTPAgain, setSendOTPAgain] = useState(0);
  // const [validate, setValidate] = useState(false);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(false);
  const [receivedOtpCode, setReceivedOtpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [resendClicked, setResendClicked] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [OTPresponse, setOTPresponse] = useState("");
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const router = useRouter()
  const [firstTime, setFirstTime] = useState(true)
  const startTimer = () => {
    setTimeLeft(60);
    setTimerRunning(true);
  };

  const handleVerify = async () => {

    const res = await fetch("/api/auth/otp/verify-otp",
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
    else 
    {

    }
    return res.status;
  }

  const handleSendOtp = async () => {
    setIsLoadingOtp(true);
    startTimer();
    setResendClicked(true);
    try {
      const res = await fetch("/api/auth/otp/send-otp",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            username: Name
          })
        }  
      );
      if(res.status === 200)
      {
        setOtp(true);
      }
      else
      {
        setOtp(false)
      }
      return res.status;
    }
    catch(e)
    {
      alert("Error in sending OTP");
    }
    finally{
      setIsLoadingOtp(false)
    }
    
  };

  const handleLogin = async () => {
    setIsLoadingSignup(true)
    const responseVerification = await handleVerify();
    if (responseVerification === 200) {

      const res = await fetch("/api/auth/signup",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            Name: Name,
            password: password,
            contact: contact
          })
        }  
      );
      if(res.status === 200)
      {
        // yaha kaafi problem aayi thi 
        // signIn nextauth client side hi hona chahiye
        try {
          const res = await signIn("signup", {
            name: Name,
            phone: contact,
            password: password,
            email: email,
            redirect:false,
          })
          if(res?.error)
          {
            alert("Some Thing Went Wrong during Sign Up")
            return new Error("Some Thing Went Wrong during Sign Up");
          }
          else 
          {
            router.push("/mpin/set")
            alert("Signed up successfully!!")
            return;
          }
        } 
        catch (e) 
        {
          console.error("Error Occurred in Withdrawal", e);
          return;
        }
        finally
        {
          setIsLoadingSignup(false)
        }
        
      }
      // setMPIN
      alert(`Error Occured during Sign up`);
      return;
    }
    return;
  };

  
  const resendOTP = () => {
    setTimerRunning(false);
    startTimer();
    setResendClicked(true);
    handleSendOtp();
  };


  
  useEffect(() => {
    let timer : any;
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


  useEffect(() => {
    if (contact === "" || contact === null) {
      setOtp(false);
      setTimeLeft(60);
      setTimerRunning(false);
      setResendClicked(false);
    }
  }, [contact]);
  

  return (
    <div onSubmit={handleLogin} className="w-full py-5 mx-5 px-10 h-max bg-white rounded-3xl">
      <div className="flex items-center justify-center gap-3 pb-2 text-purple-700">
        <span className="font-extrabold text-4xl tracking-tight">ZenPay</span>
      </div>
      <div className="font-bold text-3xl">
          Sign up
      </div>
     
      <div className="my-4">
        <div className="my-8">
          <LabelledInputAuth label="First Name" type="text" placeholder="John Doe" onChangeFunc={(name) => {
              setName(name)
          }}></LabelledInputAuth>
        </div>
        <div className="my-8">
          <LabelledInputAuth label="Email" placeholder="johndoe2@gmail.com" type="email" onChangeFunc={(email) => {
              setEmail(email)
          }}></LabelledInputAuth>
        </div>
        <div className="my-8">
          <LabelledInputAuth label="Phone Number (10 digits)" placeholder="1231231230" type="tel" onChangeFunc={(num) => {
              setContact(num)
          }}></LabelledInputAuth>
        </div>
      </div>

      <div>
        {contact && email && otp && (
          <div className="text-center text-green-500 text-base mt-1 font-semibold">
            OTP sent successfully on your email. Please enter OTP below.
          </div>
        )}
        {contact && email && otp && (
          <div className="space-y-2 w-full flex flex-col items-center justify-center my-2">
            {/* For OTP */}
            
            <InputOTPGroup type="otp" onChangeFunc = {(e : string) => {
              setReceivedOtpCode(e)
            }}></InputOTPGroup>
            <LabelledInputAuth label="Password (min 6 characters)" placeholder="1@2#3$" type="password" onChangeFunc={(pass) => {
              setPassword(pass)
            }}></LabelledInputAuth>
            <div>
              {resendClicked && timeLeft > 0 ? (
                  <p className="text-sm">
                    Resend OTP available in{" "}
                    <span className="text-blue-500">
                      {timeLeft > 0 ? `${timeLeft}` : ""}
                    </span>
                  </p>
                  ) : (
                  <button 
                    onClick={resendOTP}
                    className="text-blue-500"
                  >
                    Resend OTP
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
      {receivedOtpCode ? (
        <button disabled={isLoadingSignup}
          onClick={async () => {
            if(loginReqSchema.safeParse({Name, contact, email, receivedOtpCode, password}).success)
            {
              await handleLogin();
            }
          }}
          className="w-full mt-4 bg-green-500 hover:bg-green-400 rounded-lg h-10"
        >
          {isLoadingSignup ? <div role="status">
             <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
             </svg>
             <span className="sr-only">Loading...</span>
         </div>:"Login"}
        </button>
      ) : (
        <button disabled={isLoadingOtp}
          onClick={async () =>  {
            setIsLoadingOtp(true)
            const nextres =  nextReqSchema.safeParse({Name, contact, email}).success;
            if(nextres && (timeLeft === 0 || firstTime))
            {
              const res = await handleSendOtp();
              if(res === 400)
              {
                alert("User Already have an Account!!")
              }
              else if(res === 500)
              {
                alert("Something went wrong!")
              }
              setFirstTime(false)
            }
            else if(nextres)
            {
              alert(`Invalid Info!`)
            }
            else if(!nextres)
            {
              alert(`Enter Complete Info!, ${nextres}`)
            }
            setIsLoadingOtp(false)
          }
          }
          className="w-full mt-4 bg-green-500 hover:bg-green-400 rounded-lg h-10"
        >
          {isLoadingOtp ? 
          <div role="status">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>:"Next"}
        </button>
      )}
      {OTPresponse === "OTP Verified!!" ? (
        <p className="text-green-500 text-sm text-center mt-2">
          {OTPresponse}
        </p>
      ) : 
      <p className="text-red-500 text-sm text-center mt-2">
        {OTPresponse}
      </p>}

      <div className="pt-3 flex justify-center">already have an account?
        <button className="pl-1 text-blue-600 hover:underline" onClick={() => {
          router.push("/auth/signin")
        }}>
          Sign in
        </button>
      </div>
  </div>
    
  );
}