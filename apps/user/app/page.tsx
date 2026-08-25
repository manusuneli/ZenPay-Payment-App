import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "./lib/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getServerSession(NEXT_AUTH);
  if (session?.user) {
    redirect("/dashboard");
  } else {
    redirect("/auth/signin");
  }
}