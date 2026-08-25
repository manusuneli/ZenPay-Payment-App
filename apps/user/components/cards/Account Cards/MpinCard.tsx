"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, ArrowRight, MailCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputOTPGroup } from "../../inputotpgroup";
import { useToast } from "../../../providers/ToastProvider";

interface MpinCardInput {
  title: string;
  type: string;
}

export function MpinCard({ title, type }: MpinCardInput) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [otp, setOtp] = useState(false);
  const [receivedOtpCode, setReceivedOtpCode] = useState("");
  const [resendClicked, setResendClicked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("");
  const [mpin, setmpin] = useState("");
  const [confirmedmpin, setConfirmedmpin] = useState("");
  const [OTPresponse, setOTPresponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const startTimer = () => {
    setTimeLeft(60);
    setTimerRunning(true);
  };

  const handleVerify = async () => {
    if (!session.data?.user) {
      setError("User not logged in!");
      return 500;
    }
    try {
      const res = await fetch("/api/mpin/verify-otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.data?.user?.email,
          otp: receivedOtpCode,
        }),
      });

      if (res.status === 200) {
        setOTPresponse("OTP Verified!!");
        showToast("OTP Verified successfully!", "success");
      } else if (res.status === 400) {
        setOTPresponse("Incorrect OTP. Please try again.");
        showToast("Incorrect OTP. Please try again.", "error");
      }
      return res.status;
    } catch (err) {
      console.error(err);
      return 500;
    }
  };

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
    if (!session.data?.user) {
      setError("User not logged in!");
      return;
    }
    startTimer();
    setResendClicked(true);
    const toastId = showToast("Sending verification OTP...", "loading");
    try {
      const res = await fetch("/api/mpin/send-otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.data?.user?.email,
          username: session.data?.user?.name,
        }),
      });
      if (res.status === 200) {
        setOtp(true);
        showToast("OTP sent to your email successfully!", "success");
      } else {
        setOtp(false);
        showToast("Failed to send OTP.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error sending OTP", "error");
    }
  };

  async function setMpintoDB() {
    if (!session.data?.user) {
      setError("User not logged in!");
      return;
    }
    try {
      const res = await fetch("/api/mpin/update", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.data.user.email,
          mpin: mpin,
        }),
      });
      if (res.ok) {
        showToast("MPIN updated successfully!", "success");
        if (type === "set") {
          router.push("/accounts");
        } else {
          router.push("/profile");
        }
      } else {
        showToast("Failed to update MPIN.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to save MPIN", "error");
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-full max-w-md mx-auto transition-colors duration-300">
      
      {/* Title */}
      <div className="text-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-3 bg-purple-100 dark:bg-purple-950/50 rounded-2xl w-max mx-auto text-purple-600 dark:text-purple-400 mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {type === "set"
            ? "Let your digits defend your dollars—set your MPIN now!"
            : "New digits, new strength—update your MPIN and stay ahead!"}
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {mpin && confirmedmpin && mpin !== confirmedmpin && (
        <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>MPINs do not match</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Step 1: MPIN details inputs */}
        <div className="space-y-5">
          {/* Enter MPIN */}
          <div className="space-y-2 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Enter 4-Digit MPIN
            </span>
            <InputOTPGroup
              type="password"
              onChangeFunc={(code) => setmpin(code)}
            />
          </div>

          {/* Confirm MPIN */}
          <div className="space-y-2 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Confirm 4-Digit MPIN
            </span>
            <InputOTPGroup
              type="password"
              onChangeFunc={(code) => setConfirmedmpin(code)}
            />
          </div>
        </div>

        {/* Step 2: Update OTP Verification container */}
        {type === "update" && mpin && confirmedmpin && mpin === confirmedmpin && otp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800"
          >
            <div className="text-center space-y-1 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-xl w-max mx-auto text-green-600 dark:text-green-400">
                <MailCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">OTP Sent successfully</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Check your email for verification code</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <InputOTPGroup
                type="otp"
                onChangeFunc={(code) => setReceivedOtpCode(code)}
              />

              {/* Resend OTP countdown */}
              <div className="text-center">
                {resendClicked && timeLeft > 0 ? (
                  <p className="text-xs text-slate-500">
                    Resend code in <span className="text-purple-600 font-semibold">{timeLeft}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendOTP}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Actions */}
        {type === "set" ? (
          <button
            onClick={async () => {
              if (mpin && confirmedmpin && mpin === confirmedmpin) {
                setIsLoading(true);
                await setMpintoDB();
                setIsLoading(false);
              } else {
                showToast("MPINs must match", "error");
              }
            }}
            disabled={isLoading || !mpin || !confirmedmpin || mpin !== confirmedmpin}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-1.5 transition duration-200 shadow-md shadow-purple-500/10"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Set MPIN</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        ) : !otp ? (
          <button
            onClick={async () => {
              setIsLoading(true);
              if (mpin && confirmedmpin && mpin === confirmedmpin) {
                setError("");
                await handleSendOtp();
              } else {
                showToast("MPINs must match", "error");
              }
              setIsLoading(false);
            }}
            disabled={isLoading || !mpin || !confirmedmpin || mpin !== confirmedmpin}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-1.5 transition duration-200 shadow-md shadow-purple-500/10"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Verify Email</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        ) : (
          <button
            onClick={async () => {
              if (mpin && confirmedmpin && mpin === confirmedmpin && receivedOtpCode) {
                setIsLoading(true);
                const verifyStatus = await handleVerify();
                if (verifyStatus === 200) {
                  await setMpintoDB();
                }
                setIsLoading(false);
              } else {
                showToast("Ensure MPIN and OTP are entered correctly.", "error");
              }
            }}
            disabled={isLoading || !receivedOtpCode}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-1.5 transition duration-200 shadow-md shadow-purple-500/10"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update MPIN</span>}
          </button>
        )}
      </div>
    </div>
  );
}
