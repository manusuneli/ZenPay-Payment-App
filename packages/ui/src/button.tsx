"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClickFunc?: () => void;
  state?: boolean;
  className?: string;
}

export const Button = ({ onClickFunc, children, state, className }: ButtonProps) => {
  return (
    <button
      onClick={onClickFunc}
      disabled={state || false}
      className={className ? className : 
        "h-11 px-5 py-2.5 flex items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm transition delay-50 duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-slate-700"}
    >
      {children}
    </button>
  );
};
