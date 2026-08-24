import { redirect } from "next/navigation";
import { Calendar, Mail, MapPin } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { applicationStatusMeta, documentStatusMeta, documentTypeLabels } from "@/lib/status";
import { ResubmitIdentityForm } from "@/components/customer/ResubmitIdentityForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      document: true,
      notifications: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/login");

  const appMeta = applicationStatusMeta[user.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar name={user.name} size="lg" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">{user.name}</h1>
          <StatusPill tone={appMeta.tone} className="mt-1">
            {appMeta.label}
          </StatusPill>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Calendar} label="Date of birth" value={formatDate(user.dateOfBirth)} />
            <InfoRow icon={MapPin} label="Address" value={user.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identity document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.document && (
              <>
                <StatusPill tone={documentStatusMeta[user.document.status].tone}>
                  {documentStatusMeta[user.document.status].label}
                </StatusPill>
                <div className="overflow-hidden rounded-xl border border-border bg-surface-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user.document.imageData} alt="Your identity document" className="max-h-56 w-full object-contain" />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Type</dt>
                    <dd className="font-medium text-foreground">
                      {user.document.type ? documentTypeLabels[user.document.type] : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Expires</dt>
                    <dd className="font-medium text-foreground">
                      {user.document.expiryDate ? formatDate(user.document.expiryDate) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Place of birth</dt>
                    <dd className="font-medium text-foreground">{user.document.placeOfBirth ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Place of issue</dt>
                    <dd className="font-medium text-foreground">{user.document.placeOfIssue ?? "—"}</dd>
                  </div>
                </dl>
                {user.document.status === "RESUBMISSION_REQUESTED" && (
                  <div className="border-t border-border pt-4">
                    <ResubmitIdentityForm />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification history</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {user.notifications.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {user.notifications.map((n) => (
                <li key={n.id} className="px-5 py-4">
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
