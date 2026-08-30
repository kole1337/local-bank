import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DetailsCard } from "@/components/admin/DetailsCard";
import { IdentityCard } from "@/components/admin/IdentityCard";
import { ApproveForm } from "@/components/admin/ApproveForm";
import { DeclineDialog } from "@/components/admin/DeclineDialog";
import { StatusPill } from "@/components/ui/StatusPill";
import { applicationStatusMeta } from "@/lib/status";
import { AuditAction, recordAuditForCurrentUser } from "@/lib/audit";

export default async function ReviewApplicationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const applicant = await prisma.user.findUnique({
    where: { id: userId },
    include: { document: true },
  });

  if (!applicant || applicant.role !== "CUSTOMER") notFound();

  await recordAuditForCurrentUser(
    AuditAction.VIEWED_APPLICATION,
    `Opened the application review for ${applicant.name} (${applicant.email})`,
  );

  const appMeta = applicationStatusMeta[applicant.status];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="mb-3 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">{applicant.name}</h1>
          <StatusPill tone={appMeta.tone}>{appMeta.label}</StatusPill>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailsCard
          name={applicant.name}
          dateOfBirth={applicant.dateOfBirth}
          address={applicant.address}
          email={applicant.email}
        />
        {applicant.document && (
          <IdentityCard
            userId={applicant.id}
            imageData={applicant.document.imageData}
            status={applicant.document.status}
            type={applicant.document.type}
            placeOfBirth={applicant.document.placeOfBirth}
            placeOfIssue={applicant.document.placeOfIssue}
            expiryDate={applicant.document.expiryDate}
          />
        )}
      </div>

      {applicant.status === "PENDING" && (
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-surface p-5">
          <p className="mr-auto text-sm text-muted-foreground">
            Review the details and identity document, then make a decision.
          </p>
          <DeclineDialog userId={applicant.id} />
          <ApproveForm userId={applicant.id} />
        </div>
      )}

      {applicant.status === "DECLINED" && applicant.declineReason && (
        <div className="rounded-2xl border border-danger/20 bg-danger-accent p-5 text-sm text-danger">
          Declined: {applicant.declineReason}
        </div>
      )}
    </div>
  );
}
