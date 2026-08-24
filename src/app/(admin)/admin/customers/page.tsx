import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { applicationStatusMeta } from "@/lib/status";

export default async function CustomersDirectoryPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { account: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {customers.length} customer{customers.length === 1 ? "" : "s"} on file.
        </p>
      </div>

      {customers.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
            <Users className="h-5 w-5" />
          </span>
          <p className="text-sm text-muted-foreground">No customers yet.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {customers.map((c) => {
            const meta = applicationStatusMeta[c.status];
            return (
              <Link
                key={c.id}
                href={`/admin/customers/${c.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted"
              >
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                </div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block">
                  {c.account && <p>{formatCurrency(c.account.balanceCents)}</p>}
                  <p>Joined {formatDate(c.createdAt)}</p>
                </div>
                <StatusPill tone={meta.tone} className="hidden sm:inline-flex">
                  {meta.label}
                </StatusPill>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </Card>
      )}
    </div>
  );
}
