"use client";

import { useEffect, useState } from "react";
import { getDetailsByLinkToken } from "../../../../../lib/actions/getDetailsbyLinkToken";
import { updateAccessToken } from "../../../../../lib/actions/updateAccessToken";
import dotenv from "dotenv";
dotenv.config();
export default function LinkedAccountPage({
  params,
}: {
  params: { link_auth_token: string; done_token: string };
}) {
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const processLink = async () => {
      try {
        const { link_auth_token, done_token } = await params;

        if (!link_auth_token || !done_token) {
          setMessage("Missing link or done token.");
          setStatus("error");
          return;
        }

        // Get details by link token
        const details_link_auth_token = await getDetailsByLinkToken(link_auth_token);

        if (details_link_auth_token.msg === "Invalid or expired Token") {
          setMessage(details_link_auth_token.msg);
          setStatus("error");
          return;
        }

        // Exchange done_token for access_token
        // console.log("OKAY JI")
        const exchangeRes = await fetch(`${process.env.NEXT_PUBLIC_ZENBANK_URL}/api/link/link-account/exchange-token-get-access-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done_token }),
        });
        // console.log(exchangeRes)

        if (!exchangeRes.ok) {
          setMessage("Exchange token failed. Try linking again!");
          setStatus("error");
          return;
        }

        const exchangeData = await exchangeRes.json();
        const { access_token } = exchangeData;

        // Now update access token in DB + clean redis
        const updateResult = await updateAccessToken(
          link_auth_token,
          done_token,
          access_token
        );

        console.log("HERE")
        setMessage(updateResult.msg);
        console.log(updateResult.msg)
        if (updateResult.msg === "Account linked successfully!") {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setMessage("Something went wrong.");
        setStatus("error");
      }
    };

    processLink();
  }, [params]);
return (
    <div className="flex items-center justify-center min-h-screen">
      {status === "processing" && (
        <Card>
          <Spinner />
          <h2 className="text-xl font-semibold text-blue-700">Processing your account link...</h2>
        </Card>
      )}

      {status === "success" && (
        <Card>
          <IconCheck />
          <h2 className="text-2xl font-bold text-green-700">{message}</h2>
          <LinkButton href="/dashboard" color="green">Go to Dashboard</LinkButton>
        </Card>
      )}

      {status === "error" && (
        <Card>
          <IconError />
          <h2 className="text-xl font-semibold text-red-700">{message}</h2>
          <LinkButton href="/" color="red">Go Home</LinkButton>
        </Card>
      )}
    </div>
  );
}

function Card({ children }: any) {
  return (
    <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      {children}
    </div>
  );
}

function Spinner() {
  return <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>;
}

function IconCheck() {
  return (
    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function IconError() {
  return (
    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

function LinkButton({ href, children, color }: any) {
  const bg = color === "green" ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500";
  return (
    <a href={href} className={`mt-4 inline-block ${bg} text-white font-semibold py-3 px-6 rounded-xl transition`}>
      {children}
    </a>
  );
}