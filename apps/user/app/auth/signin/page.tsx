import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "../../lib/auth";
import FormPageSignin from "../../../components/forms/formpagesignin";
import AuthBrandingPanel from "../../../components/forms/AuthBrandingPanel";

export default async function RegisterPage() {
  const session = await getServerSession(NEXT_AUTH);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f7ff] dark:bg-[#0f0f1a] transition-colors duration-300">
      <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Branding Panel */}
        <AuthBrandingPanel text="Step into ZenPay — where your money moves smarter." />

        {/* Right Side: Form Container */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 sm:px-12 py-10 bg-[#f8f7ff] dark:bg-[#0f0f1a] overflow-y-auto">
          <FormPageSignin />
        </div>
      </div>
    </div>
  );
}
