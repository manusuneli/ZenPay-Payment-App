"use client";
import React, { useEffect, useState } from "react";
import LabelledInputAuth from "@repo/ui/labelledinputauth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginButton } from "@repo/ui/loginbutton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function FormPageSignin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      alert(errorParam);
    }
  }, [searchParams]);

  async function onSubmit(e?: React.FormEvent, phone?: string, pass?: string) {

    if (e) e.preventDefault();
    setisLoading(true);
    try {
      const res = await signIn("signin", {
        phone: phone ?? phoneNumber,
        password: pass ?? password,
        redirect: false,
      });

      if (!res?.error) {
        router.push("/dashboard");
        alert("Signed in Successfully!!");
      } else {
        alert("Invalid phone number or password");
      }
    } catch (err: any) {
      console.log(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setisLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-lg mx-auto my-12 px-8 py-10 bg-white rounded-3xl border border-gray-300 shadow-lg"
    >
      <div className="flex items-center justify-center gap-3 pb-2 text-purple-700">
        <span className="font-extrabold text-4xl tracking-tight">ZenPay</span>
      </div>

      <div className="text-center text-2xl font-bold text-gray-800 mt-2 mb-10">
        Sign in
      </div>

      <div className="space-y-8">
        <LabelledInputAuth
          label="Phone Number"
          type="tel"
          placeholder="1231231230"
          onChangeFunc={(num) => setPhoneNumber(num)}
        />

        <LabelledInputAuth
          label="Password (min 6 characters)"
          placeholder="1@3/4*6"
          type="password"
          onChangeFunc={(pass) => setPassword(pass)}
        />

        <div className="mt-6 flex justify-center">
          <LoginButton state={isLoading} onClickFunc={() => {}}>
            {isLoading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-400 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 
                    50 100.591C22.3858 100.591 0 78.2051 
                    0 50.5908C0 22.9766 22.3858 0.59082 
                    50 0.59082C77.6142 0.59082 100 22.9766 
                    100 50.5908ZM9.08144 50.5908C9.08144 73.1895 
                    27.4013 91.5094 50 91.5094C72.5987 91.5094 
                    90.9186 73.1895 90.9186 50.5908C90.9186 
                    27.9921 72.5987 9.67226 50 9.67226C27.4013 
                    9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 
                    38.4038 97.8624 35.9116 97.0079 
                    33.5539C95.2932 28.8227 92.871 
                    24.3692 89.8167 20.348C85.8452 
                    15.1192 80.8826 10.7238 75.2124 
                    7.41289C69.5422 4.10194 63.2754 
                    1.94025 56.7698 1.05124C51.7666 
                    0.367541 46.6976 0.446843 41.7345 
                    1.27873C39.2613 1.69328 37.813 
                    4.19778 38.4501 6.62326C39.0873 
                    9.04874 41.5694 10.4717 44.0505 
                    10.1071C47.8511 9.54855 51.7191 
                    9.52689 55.5402 10.0491C60.8642 
                    10.7766 65.9928 12.5457 70.6331 
                    15.2552C75.2735 17.9648 79.3347 
                    21.5619 82.5849 25.841C84.9175 
                    28.9121 86.7997 32.2913 88.1811 
                    35.8758C89.083 38.2158 91.5421 
                    39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              "Sign in"
            )}
          </LoginButton>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onSubmit(undefined, "1212121212", "121212")}
            className="mt-4 bg-indigo-500 text-white rounded-xl py-2 px-6 font-medium hover:bg-indigo-600 transition"
          >
            Use Demo Credentials
          </button>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-700">
        <div className="flex justify-center">
          <span>Don't remember password?</span>
          <Link
            className="text-indigo-600 hover:underline ml-1"
            href="/update/password"
          >
            Forgot password
          </Link>
        </div>
        <div className="flex justify-center mt-2">
          <span>Don't have an account?</span>
          <Link
            className="text-indigo-600 hover:underline ml-1"
            href="/auth/signup"
          >
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}
