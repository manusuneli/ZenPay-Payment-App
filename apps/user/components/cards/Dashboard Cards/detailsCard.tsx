"use client"
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";

export default function DetailsCard({
  detailName,
  details,
  to,
  yesRequiredUpdation,
}: {
  detailName: string;
  details: string;
  to: string;
  yesRequiredUpdation: boolean;
}) {
  const router = useRouter();
  return (
    <div className="flex shadow-sm max-w-full w-full">
      <div className="flex items-center justify-between my-4 px-6 w-full gap-4">
        {/* Detail Name */}
        <div className="font-medium whitespace-nowrap">{detailName}</div>

        {/* Detail Value (truncates if too long) */}
        <div
          className="flex-1 text-center ml-10 overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
          title={details}
        >
          {details}
        </div>

        {/* Optional Button */}
        {yesRequiredUpdation && (
          <Button
            onClickFunc={() => {
              router.push(to);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
