import { Clock, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { TransactionList } from "@/components/customer/TransactionList";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
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
      <div className="mx-auto max-w-lg py-16 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Clock className="h-6 w-6" />
        </span>
        <h1 className="text-xl font-semibold text-foreground">Your application is under review</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for applying, {user.name.split(" ")[0]}. Our team is reviewing your details and identity
          document. We&apos;ll notify you as soon as a decision has been made.
        </p>
      </div>
    );
  }

  if (user.status === "DECLINED") {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-accent text-danger">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="text-xl font-semibold text-foreground">Your application was declined</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {user.declineReason ?? "Please contact support for more information."}
        </p>
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
