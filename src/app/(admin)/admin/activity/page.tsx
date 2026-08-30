import { ScrollText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { AuditAction, recordAuditForCurrentUser } from "@/lib/audit";

const PAGE_SIZE = 200;

function actorTone(role: string | null) {
  if (role === "EMPLOYEE") return "positive" as const;
  if (role === "CUSTOMER") return "neutral" as const;
  return "warning" as const;
}

export default async function ActivityLogPage() {
  await recordAuditForCurrentUser(AuditAction.VIEWED_ACTIVITY_LOG);

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Activity log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every action taken by customers and bank staff, with the device, browser and IP address it
          came from. Showing the {logs.length} most recent event{logs.length === 1 ? "" : "s"}.
        </p>
      </div>

      {logs.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
            <ScrollText className="h-5 w-5" />
          </span>
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Browser</th>
                  <th className="px-4 py-3 font-medium">IP address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {log.actorEmail ?? "Unknown"}
                      </div>
                      {log.actorRole && (
                        <StatusPill tone={actorTone(log.actorRole)} className="mt-1">
                          {log.actorRole === "EMPLOYEE" ? "Bank staff" : "Customer"}
                        </StatusPill>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{log.detail ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {log.device ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {log.browser ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.ipAddress ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
