import { getServerSession } from "next-auth";
import { prisma } from "@repo/db/client";
import { FaUserCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { AccountButton } from "../../../../components/accountButton";
import { getBalance } from "../../../lib/actions/getBalance";
import { NEXT_AUTH } from "../../../lib/auth";

async function getDetails() {
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user.email) {
    throw new Error("User not logged in!");
  }

  const userDetails = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    include: {
      accounts: true, // get linked accounts
    },
  });
  return userDetails;
}

export default async function ProfilePage() {
  const session = await getServerSession(NEXT_AUTH);
  const user = session?.user;

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        User not logged in!
      </div>
    );
  }

  const balance = await getBalance();
  let userDetails;
  try {
    userDetails = await getDetails();
  } catch (error: any) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex-auto">
      <h1 className="mx-4 mt-20 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
        Profile
      </h1>
      <div className="flex-auto bg-[#fdf0f6] flex justify-center items-center px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
          
          <div className="bg-purple-50 flex flex-col items-center justify-center p-10 w-full md:w-1/3">
            <FaUserCircle size={100} className="text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Hey {session.user.name},
            </h2>
            <p className="text-lg font-semibold text-green-600 mb-6">
              Balance: ₹ {((balance.balance?.amount || 0) / 100).toFixed(2)}
            </p>
            <AccountButton
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition"
              to="transfer/deposit"
            >
              Add Money
            </AccountButton>
          </div>

          <div className="flex-1 p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={userDetails?.name || ""}
                  disabled
                  className="w-full shadow-sm py-0.5 px-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={userDetails?.number || ""}
                  disabled
                  className="w-full shadow-sm py-0.5 px-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={userDetails?.email || ""}
                  disabled
                  className="w-full shadow-sm py-0.5 px-2"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Accounts Linked
                  </label>
                  <AccountButton
                    to="accounts"
                    className="block text-xs font-medium text-blue-600 mb-1 mx-2 hover:underline cursor-pointer"
                  >See All</AccountButton>
                </div>
                <div className="space-y-2">
                  {userDetails?.accounts && userDetails?.accounts?.length > 0 ? (
                    userDetails.accounts.map((account, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={`${account.accountNumber} (${account.ifsc})`}
                        disabled
                        className="w-full shadow-sm py-0.5 px-2"
                      />
                    ))
                  ) : (
                    <div className="text-gray-500">No accounts linked.</div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <a
                    href="/link-account"
                    className="bg-purple-600 text-white px-4 py-2 rounded-full shadow hover:bg-purple-700 transition text-sm"
                  >
                    + Add Account
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 rounded-xl px-6 py-4 shadow-inner">
                <div>
                  <div className="text-gray-700 font-medium">Password</div>
                  <div className="text-gray-500">********</div>
                </div>
                <AccountButton
                  to="update/password"
                  className="text-purple-600 hover:text-purple-800"
                >
                  <FiRefreshCw size={24} />
                </AccountButton>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded-xl px-6 py-4 shadow-inner">
                <div>
                  <div className="text-gray-700 font-medium">MPIN</div>
                  <div className="text-gray-500">****</div>
                </div>
                <AccountButton
                  to="/mpin/update"
                  className="text-purple-600 hover:text-purple-800"
                >
                  <FiRefreshCw size={24} />
                </AccountButton>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
