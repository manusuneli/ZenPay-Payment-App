"use client"
import React, { useState, useEffect } from 'react';
import { FaRegCreditCard } from 'react-icons/fa6';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { HiOutlineRefresh } from "react-icons/hi";
import { getBalance } from '../../../app/lib/actions/getBalance';
import { ButtonDashboardtoRedirect } from '../../buttons/buttonsUsed';
import { useRouter } from 'next/navigation';
import { P2P } from '@repo/ui/icons';
import { IoIosTrendingDown } from "react-icons/io";

interface MainCardDashboardProps {
  currency?: string;
}

export function MainCardDashboard({ currency = '₹' }: MainCardDashboardProps) {
  const [balance, setBalance] = useState<string>("0.00");
  const [toShow, setToShow] = useState<boolean>(true);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshBalance = async () => {
    setIsLoading(true);
    try {
      const data = await getBalance();
      const amt = (Number(data?.balance?.amount) / 100).toFixed(2) || "0.00";
      setBalance(amt);
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshBalance();
  }, []);

  return (
    <div className="col-span-2 bg-purple-500/95 text-white rounded-3xl p-6 sm:p-8 lg:py-10 shadow-3xl h-max my-auto">
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={refreshBalance}
          title="Refresh balance"
          className="relative p-2 bg-purple-600/60 rounded-full hover:bg-purple-600 transition"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <HiOutlineRefresh className="text-white" size={24} />
          )}
        </button>

        <button
          onClick={() => setToShow(v => !v)}
          title={toShow ? 'Hide balance' : 'Show balance'}
          className="p-2 bg-purple-600/60 rounded-full hover:bg-purple-600 transition"
        >
          {toShow ? (
            <HiOutlineEyeSlash className="text-white" size={24} />
          ) : (
            <HiOutlineEye className="text-white" size={24} />
          )}
        </button>
      </div>

      <div className="flex items-center text-white mt-4 mb-3">
        <FaRegCreditCard size={24} />
        <span className="uppercase text-md font-medium ml-2">Your Balance</span>
      </div>

      <h2 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight mx-4 sm:mx-10 break-words">
        {currency} {toShow ? (`${balance === "NaN" ? "0.00" : balance}`) : '••••••'}
      </h2>
      <p className="text-purple-200 mt-1 text-sm">Available balance</p>
      <p className="text-purple-200 text-xs mt-1">Last updated: {updatedAt}</p>

      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
        <ButtonDashboardtoRedirect to="/transfer/deposit">
          <div className='flex items-center justify-center'>
            <div className='px-2'>
              <IoIosTrendingDown strokeWidth={18} size={25} />
            </div>
            Add Money
          </div>
        </ButtonDashboardtoRedirect>
        <ButtonDashboardtoRedirect to="/p2p">
          <div className='flex items-center justify-center'>
            <div className='px-2'>
              <P2P />
            </div>
            Send Money
          </div>
        </ButtonDashboardtoRedirect>
      </div>
    </div>
  );
}

export function ActionCard({ icon, label, to }: any) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(to)}
      className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
    >
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
    </button>
  );
}
