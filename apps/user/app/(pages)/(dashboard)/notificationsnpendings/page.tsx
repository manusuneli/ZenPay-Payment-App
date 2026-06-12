import { prisma } from "@repo/db/client";
import NotificationsCards from "../../../../components/notificationsnpendings/NotificationCards";
import NotificationsTable from "../../../../components/notificationsnpendings/NotificationTable";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  const userId = session?.user?.id;
  const notifications = await prisma.notification.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      splitEntry:{
        select:{
          status: true
        }
      }
    }
  });

  // console.log(notifications)
  return (
    <div className="w-full mx-auto px-4 mb-14 sm:px-6 mt-8">
      <h1 className="mt-14 text-3xl ml-14 py-1 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
        Notifications & Pendings
      </h1>
      <div className="space-y-6">
        <NotificationsTable notifications={notifications} />
        <NotificationsCards notifications={notifications} />
      </div>
    </div>
  );
}
