import { Bell, AlertCircle, IndianRupee, XCircle } from "lucide-react";
import { NotificationsApproveButton } from "./NotificationApproveButton";

export default function NotificationsCards({ notifications }: { notifications: any }) {
  return (
    <div className="md:hidden space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-4">
          No notifications found.
        </div>
      ) : (
        notifications.map((item: any) => {
          const status = item.splitEntry?.status;

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-2"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                    status === "REJECTED"
                      ? "bg-[#fee2e2]"
                      : item.type === "PAYMENT"
                      ? "bg-[#fde4e1]"
                      : item.type === "TRANSFER"
                      ? "bg-[#e0f2f1]"
                      : "bg-[#e0f2ff]"
                  }`}
                >
                  {status === "REJECTED" ? (
                    <XCircle className="w-5 h-5 text-[#dc2626]" strokeWidth={1.5} />
                  ) : item.type === "PAYMENT" ? (
                    <Bell className="w-5 h-5 text-[#b45309]" strokeWidth={1.5} />
                  ) : item.type === "TRANSFER" ? (
                    <IndianRupee className="w-5 h-5 text-[#047857]" strokeWidth={1.5} />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#1e40af]" strokeWidth={1.5} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 break-words">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 break-words mt-1">
                    {item.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <div>
                  <span className="block">
                    Type:{" "}
                    <span className="font-semibold text-gray-700">
                      {item.type}
                    </span>
                  </span>
                  {status && (
                    <span className="block">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          status === "REJECTED"
                            ? "text-[#dc2626]"
                            : status === "SUCCESS"
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        {status}
                      </span>
                    </span>
                  )}
                  <span className="block mt-1">
                    {new Date(item.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex-shrink-0">
                  {status === "REJECTED" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#dc2626]">
                      Rejected
                    </span>
                  ) : status === "SUCCESS" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Paid
                    </span>
                  ) : item.action !== "VIEW" && (
                    <NotificationsApproveButton
                      id={item.id}
                      action={item.action}
                      status={status}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
