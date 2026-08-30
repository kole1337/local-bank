"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { AuditAction, recordAuditForCurrentUser } from "@/lib/audit";

export async function markAllNotificationsReadAction() {
  const session = await getSession();
  if (!session) return;

  const { count } = await prisma.notification.updateMany({
    where: { userId: session.userId, read: false },
    data: { read: true },
  });

  if (count > 0) {
    await recordAuditForCurrentUser(
      AuditAction.NOTIFICATIONS_READ,
      `Marked ${count} notification${count === 1 ? "" : "s"} as read`,
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
}
