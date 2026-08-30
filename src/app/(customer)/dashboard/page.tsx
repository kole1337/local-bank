import { Calendar, Clock, Mail, MapPin, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { StatusPill } from "@/components/ui/StatusPill";
import { LinkButton } from "@/components/ui/LinkButton";
import { TransactionList } from "@/components/customer/TransactionList";
import { documentStatusMeta } from "@/lib/status";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      document: true,
      account: {
        include: {
          transactions: { orderBy: { createdAt: "desc" }, take: 15 },
        },
      },
    },
  });

  if (!user) redirect("/login");

  if (user.status === "PENDING") {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-10">
        <div className="text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-warning-accent text-warning-foreground">
            <Clock className="h-6 w-6" />
          </span>
          <StatusPill tone="warning">Pending</StatusPill>
          <h1 className="mt-3 text-xl font-semibold text-foreground">
            Your application is under review
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks for applying, {user.name.split(" ")[0]}. Our team is reviewing your details and
            identity document — we&apos;ll notify you as soon as a decision has been made.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow icon={Calendar} label="Date of birth" value={formatDate(user.dateOfBirth)} />
            <DetailRow icon={MapPin} label="Address" value={user.address} />
            <DetailRow icon={Clock} label="Submitted" value={formatDate(user.createdAt)} />
            {user.document && (
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Identity document</span>
                <StatusPill tone={documentStatusMeta[user.document.status].tone}>
                  {documentStatusMeta[user.document.status].label}
                </StatusPill>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.status === "DECLINED") {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-accent text-danger">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <StatusPill tone="negative">Declined</StatusPill>
        <h1 className="text-xl font-semibold text-foreground">
          Your application was declined, please start a new one
        </h1>
        {user.declineReason && (
          <p className="text-sm text-muted-foreground">{user.declineReason}</p>
        )}
        <div>
          <LinkButton href="/onboarding">Start a new application</LinkButton>
        </div>
      </div>
    );
  }

  const account = user.account;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      {!account ? (
        <Alert tone="danger" title="Account unavailable">
          We couldn&apos;t find an account for your profile. Please contact support.
        </Alert>
      ) : (
        <>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-1 p-6">
              <p className="text-sm text-primary-foreground/80">Available balance</p>
              <p className="text-3xl font-semibold tracking-tight">{formatCurrency(account.balanceCents)}</p>
              <p className="mt-2 text-xs text-primary-foreground/70">Account · {account.accountNumber}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent transactions</CardTitle>
            </CardHeader>
            <div className="mt-3">
              <TransactionList transactions={account.transactions} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
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
