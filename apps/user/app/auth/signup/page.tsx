import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "../../lib/auth";
import FormPageSignup from "../../../components/forms/formpagesignup";

export default async function RegisterPage() {
  const session = await getServerSession(NEXT_AUTH);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-purple-700 to-purple-300">
        
        <div className="hidden md:flex w-full md:w-1/2 relative text-white p-10 flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ffffff22,transparent_70%)] z-0 opacity-20" />

          <div className="z-10 mb-6">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M3 6a2 2 0 012-2h14a2 2 0 012 2v1H3V6zM3 9h18v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>

          <div className="z-10">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight drop-shadow-md">
              Welcome to ZenPay
            </h1>
            <p className="text-lg font-medium opacity-95 max-w-sm leading-relaxed drop-shadow-sm">
              Join ZenPay — Where Payments Feel Effortless.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10 sm:px-12">
          {/* <div className="md:hidden mb-8 w-full text-left">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome to ZenPay</h1>
            </div> */}
          <FormPageSignup />
        </div>
      </div>
    </div>
  );
}
