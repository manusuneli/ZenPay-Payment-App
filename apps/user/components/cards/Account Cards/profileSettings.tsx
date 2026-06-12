"use client";

import { useState, ChangeEvent } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { AccountButton } from "../../accountButton";

// Type for props expected from server page
interface ProfileSettingsClientProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  userDetails: {
    name?: string;
    number?: string;
    email?: string;
    password?: string;
    id?: number;
    MPIN?: string;
  } | null;
  balance: number;
}

// Type for form state
interface FormData {
  name: string;
  number: string;
  email: string;
  accountNumber: string;
}

export default function ProfileSettingsClient({
  user,
  userDetails,
  balance,
}: ProfileSettingsClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: userDetails?.name || "",
    number: userDetails?.number || "",
    email: userDetails?.email || "",
    accountNumber: "7838909398300nuidfn",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    
    console.log("Saving", formData);
    setIsEditing(false);
  };

  return (
    <div className="flex-auto">
      <div className="flex justify-between items-center mx-8 mt-20 mb-8">
        <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold">
          Account Settings
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="flex-auto bg-[#fdf0f6] flex justify-center items-center px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">

          <div className="bg-purple-50 flex flex-col items-center justify-center p-10 w-full md:w-1/3">
            <FaUserCircle size={100} className="text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Hey {user.name},</h2>
            <p className="text-lg font-semibold text-green-600 mb-6">
              Balance: ₹ {(balance / 100).toFixed(2)}
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full shadow-sm py-0.5 px-2 ${isEditing ? "border border-gray-300" : "bg-gray-100"}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Contact</label>
                <input
                  name="number"
                  type="text"
                  value={formData.number}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full shadow-sm py-0.5 px-2 ${isEditing ? "border border-gray-300" : "bg-gray-100"}`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full shadow-sm py-0.5 px-2 ${isEditing ? "border border-gray-300" : "bg-gray-100"}`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  readOnly
                  className="w-full shadow-sm py-0.5 px-2 bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 rounded-xl px-6 py-4 shadow-inner">
                <div>
                  <div className="text-gray-700 font-medium">Password</div>
                  <div className="text-gray-500">********</div>
                </div>
                <AccountButton to="update/password" className="text-purple-600 hover:text-purple-800">
                  <FiRefreshCw size={24} />
                </AccountButton>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded-xl px-6 py-4 shadow-inner">
                <div>
                  <div className="text-gray-700 font-medium">MPIN</div>
                  <div className="text-gray-500">****</div>
                </div>
                <AccountButton to="/mpin/update" className="text-purple-600 hover:text-purple-800">
                  <FiRefreshCw size={24} />
                </AccountButton>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!isEditing}
                className={`px-8 py-3 rounded-full font-semibold shadow transition ${
                  isEditing
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
