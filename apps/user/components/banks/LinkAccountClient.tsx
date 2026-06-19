"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { InputOTPGroup } from "../inputotpgroup";
import { cacheInRedis } from "../../app/lib/actions/cacheLinkUserDetails";


const ZENBANK_URL = process.env.NEXT_PUBLIC_ZENBANK_URL;
export default function LinkAccountForm({ userId, number, emailUser }: { userId: number, number: string, emailUser: string }) {
  const { data: session } = useSession();
  const [step, setStep] = useState("info");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailUser || "");
  const [phone, setPhone] = useState(number || "");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bank, setBank] = useState("ZENBANK");
  const [mpin, setMpin] = useState("");
  const [otp, setOtp] = useState("");

  const banks = ["ZENBANK", "HDFC", "ICICI", "SBI", "AXIS", "KOTAK"];

  const handleNextInfo = async () => {
    // zod
    if (!(name && email && /^\d{10}$/.test(phone) && accountNumber && ifsc && bank)) {
      return alert("Please fill all fields correctly.");
    }
    setLoading(true);
    if (bank !== "ZENBANK") {
      setLoading(false);
      return alert(`We currently have contact only with ZENBANK !!
We don't currently have contacts with this bank`)
    }
    try {
      const resUser = await fetch("/api/link-account/checkIsValidUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, email: email, phone: phone, name: name, accountNumber: accountNumber, ifsc: ifsc })
      });
      if (!resUser.ok || resUser.status === 400) {
        setLoading(false);
        return alert("Invalid Details Enter, check them once !!");
      }
      else if (resUser.status === 500) {
        setLoading(false);
        return alert("something Wrong Occured, TRY AGAIN !!")
      }
      const data = await resUser.json();
      alert(data.msg);

      setStep("mpin");
    } catch (err) {
      // console.log(err)
      alert("Error in Data Entered.");
    }
    setLoading(false);
  };
  const handleNextMpin = async () => {
    if (mpin.length !== 4) return alert("MPIN must be 4 digits.");
    setLoading(true);
    try {
      const resMpin = await fetch("/api/mpin/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Mpin: mpin, email })
      });
      const response = await resMpin.json();
      if (!resMpin.ok) {
        setLoading(false);
        throw new Error("MPIN validation failed");
      }
      else if (response === "Invalid MPIN") {
        setLoading(false);
        return alert(response.msg)
      }
      setLoading(false);
      setStep("otp");
    } catch (err: any) {
      alert("Error: " + err.message);
      return setLoading(false);
    }
    setLoading(false);
    try {
      const resOtp = await fetch("/api/link-account/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, accountNumber, ifsc, bank, name })
      });
      if (!resOtp.ok) throw new Error("Failed to send OTP.");
    }
    catch (err: any) {
      setLoading(false);
      alert("Error: " + err.message);
    }
  };

  const handleFinalSubmit = async () => {
    if (otp.length !== 4) return alert("OTP must be 4 digits.");
    setLoading(true);

    try {
      const res = await fetch("/api/link-account/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email }),
      });

      if (!res.ok) {
        setLoading(false);
        return alert("OTP verification failed.");
      }

      const bank_res = await fetch(`${ZENBANK_URL}/api/link/link-account/get-linking-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIdAccordingToWallet: userId,
          phoneNumber: number,
          email: session?.user?.email,
          call_back_URL: `${process.env.NEXT_PUBLIC_ZENPAY_URL}/account-linked`,
          accountNumber,
          ifsc,
          provider: bank,
        }),
      });

      if (bank_res.status === 400) {
        setLoading(false);
        alert("Ensure you have an account in this bank or correct the account number.");
        setStep("info");
        return;
      }

      if (bank_res.status === 500) {
        setLoading(false);
        alert("Bank linking issue. Try again!");
        setStep("info");
        return;
      }

      const data = await bank_res.json();
      const token = data?.token;

      if (!token) {
        throw new Error("No linking token received from bank.");
      }

      await cacheInRedis({
        userId: userId.toString(),
        name: session?.user?.name || "",
        phoneNumber: number,
        email: session?.user?.email || "",
        accountNumber,
        ifsc,
        bank,
        token,
        provider: bank,
      });

      window.location.href = `${ZENBANK_URL}/link-account/${token}`;
    } catch (err) {
      console.error("[Linking Error]", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl p-6 sm:p-10 md:p-12 my-6">
      <div className="text-center text-sm text-gray-500 mb-2">
        {step === "info" && "Step 1 of 3"}
        {step === "mpin" && "Step 2 of 3"}
        {step === "otp" && "Step 3 of 3"}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-700 mb-6">
        {step === "info" && "Link Your Bank Account"}
        {step === "mpin" && "Enter MPIN"}
        {step === "otp" && "Verify OTP"}
        {step === "done" && "Account Linked!"}
      </h2>

      {step === "info" && (
        <>
          <Input label="Full Name" value={name} onChange={setName} required />
          <Input label="Email" type="email" inputMode="email" value={email} onChange={setEmail} required />
          <Input label="Phone Number" type="tel" inputMode="numeric" pattern="\d{10}" maxLength={10} value={phone} onChange={setPhone} required />
          <Input label="Account Number" inputMode="numeric" value={accountNumber} onChange={setAccountNumber} required />
          <Input label="IFSC Code" value={ifsc} onChange={setIfsc} required />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {banks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <PrimaryButton onClick={handleNextInfo} disabled={loading}>{loading ? <Spinner /> : "Continue"}</PrimaryButton>
        </>
      )}

      {step === "mpin" && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter 4-digit MPIN</label>
          <InputOTPGroup onChangeFunc={setMpin} type="password" />
          <PrimaryButton onClick={handleNextMpin} disabled={loading}>{loading ? <Spinner /> : "Verify MPIN"}</PrimaryButton>
        </>
      )}

      {step === "otp" && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter 4-digit OTP</label>
          <InputOTPGroup onChangeFunc={setOtp} type="text" />
          <PrimaryButton onClick={handleFinalSubmit} disabled={loading}>{loading ? <Spinner /> : "Link Account"}</PrimaryButton>
        </>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center space-y-4 py-6">
          <FaCheckCircle className="text-green-500" size={64} />
          <p className="text-xl font-semibold text-green-600">Account linked successfully!</p>
        </div>
      )}
    </div>
  );
}


function Input({ label, value, onChange, type = "text", inputMode, maxLength, pattern, required }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

function PrimaryButton({ onClick, children, disabled }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full mt-4 py-3 rounded-lg font-semibold text-white transition ${disabled ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
        }`}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center">
      <div className="h-5 w-5 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
    </div>
  );
}
