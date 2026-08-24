import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { TransactionList } from "@/components/customer/TransactionList";
import { applicationStatusMeta, documentStatusMeta, documentTypeLabels } from "@/lib/status";

export default async function CustomerPersonViewPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const customer = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      document: true,
      account: { include: { transactions: { orderBy: { createdAt: "desc" } } } },
    },
  });

  if (!customer || customer.role !== "CUSTOMER") notFound();

  const transactions = customer.account?.transactions ?? [];
  const totalVolumeCents = transactions.reduce((sum, tx) => sum + Math.abs(tx.amountCents), 0);
  const lastActivity = transactions[0]?.createdAt;
  const appMeta = applicationStatusMeta[customer.status];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/customers" className="mb-3 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Link>
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{customer.name}</h1>
            <StatusPill tone={appMeta.tone} className="mt-1">
              {appMeta.label}
            </StatusPill>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Account balance" value={customer.account ? formatCurrency(customer.account.balanceCents) : "—"} />
        <StatCard label="Total transaction volume" value={formatCurrency(totalVolumeCents)} sub={`${transactions.length} transactions`} />
        <StatCard label="Last activity" value={lastActivity ? formatDate(lastActivity) : "No activity yet"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={customer.email} />
            <InfoRow icon={Calendar} label="Date of birth" value={formatDate(customer.dateOfBirth)} />
            <InfoRow icon={MapPin} label="Address" value={customer.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identity document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.document ? (
              <>
                <StatusPill tone={documentStatusMeta[customer.document.status].tone}>
                  {documentStatusMeta[customer.document.status].label}
                </StatusPill>
                <div className="overflow-hidden rounded-xl border border-border bg-surface-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={customer.document.imageData} alt="Identity document" className="max-h-56 w-full object-contain" />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Type</dt>
                    <dd className="font-medium text-foreground">
                      {customer.document.type ? documentTypeLabels[customer.document.type] : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Expires</dt>
                    <dd className="font-medium text-foreground">
                      {customer.document.expiryDate ? formatDate(customer.document.expiryDate) : "—"}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No document on file.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        <div className="mt-3">
          <TransactionList transactions={transactions} />
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
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
