import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "./lib/auth";

export default async function Page() {

  // https://dev.to/abdur_rakibrony_97cea0e9/building-a-secure-otp-based-login-system-in-nextjs-2od8
  const session = await getServerSession(NEXT_AUTH);
  if(session?.user)
  {
    redirect("/dashboard");
  }
  else
  {
    redirect("/auth/signin");
  }
}


// state management
// Dashboard
// Dummy Bank