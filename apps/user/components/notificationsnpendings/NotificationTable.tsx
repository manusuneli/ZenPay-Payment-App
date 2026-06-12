import { Bell, AlertCircle, IndianRupee, XCircle } from "lucide-react";
import { NotificationsApproveButton } from "./NotificationApproveButton";

export default function NotificationsTable({ notifications }: { notifications: any }) {
  return (
    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      {notifications.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-8">No notifications found.</div>
      ) : (
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="p-4">Type</th>
              <th className="p-4">Title</th>
              <th className="p-4">Description</th>
              <th className="p-4">Time</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((item: any) => {
              const status = item.splitEntry?.status;
              return (
                <tr key={item.id} className="border-b last:border-none hover:bg-gray-100">
                  <td className="p-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      status === "REJECTED"
                        ? "bg-[#fee2e2]"
                        : item.type === "PAYMENT"
                        ? "bg-[#fde4e1]"
                        : item.type === "TRANSFER"
                        ? "bg-[#e0f2f1]"
                        : "bg-[#e0f2ff]"
                    }`}>
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
                  </td>
                  <td className="p-4 font-medium text-sm truncate max-w-[180px]">{item.title}</td>
                  <td className="p-4 text-gray-600 text-sm truncate max-w-[250px]">{item.message}</td>
                  <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-right">
                    {status === "REJECTED" ? (
                      <span className="text-xs font-semibold text-[#dc2626]">Rejected</span>
                    ) : item.action !== "VIEW" && (
                      <NotificationsApproveButton id={item.id} action={item.action} status={status} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
