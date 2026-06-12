import { type ReactNode } from "react";

export function Card({
  title,
  children,
  IsviewAll
}: {
  title?: string;
  children?: ReactNode;
  IsviewAll ?: boolean | false;
}) {
  return (
    <div className="min-w-fit w-full max-h-screen">
      {/* <div className="flex"> */}
        
          {IsviewAll ? 
          <div className="flex justify-between border-b">
            <h1 className="flex justify-between font-bold text-xl px-2 py-1">
              {title}
            </h1> 
            <a href="/transactions/p2p" className="text-sm text-indigo-500 hover:underline text-center pt-2 px-1">
              View All
            </a>
            </div>
           : 
           <h1 className="font-bold text-xl px-4 border-b pb-2 pt-3">
            {title}
          </h1> }
      {/* </div> */}
      <div>
        {children}
      </div>
      
    </div>
  );
}
