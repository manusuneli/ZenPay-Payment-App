import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { NEXT_AUTH } from "../../lib/auth";
import { prisma } from "@repo/db/client";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: Number(session.user.id),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        splitEntry: {
          select: {
            status: true,
          },
        },
      },
      take: 10,
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
