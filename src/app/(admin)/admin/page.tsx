import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

export default async function ApplicationsQueuePage() {
  const applications = await prisma.user.findMany({
    where: { role: "CUSTOMER", status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { document: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {applications.length} application{applications.length === 1 ? "" : "s"} waiting for review.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
            <Inbox className="h-5 w-5" />
          </span>
          <p className="text-sm text-muted-foreground">No pending applications right now — you&apos;re all caught up.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/admin/review/${app.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted"
            >
              <Avatar name={app.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{app.name}</p>
                <p className="truncate text-xs text-muted-foreground">{app.email}</p>
              </div>
              <div className="hidden text-right text-xs text-muted-foreground sm:block">
                <p>Applied {formatDate(app.createdAt)}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
