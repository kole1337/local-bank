import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { DocumentDetailsForm } from "./DocumentDetailsForm";
import { ResubmitForm } from "./ResubmitForm";
import { documentStatusMeta } from "@/lib/status";

export function IdentityCard({
  userId,
  imageData,
  status,
  type,
  placeOfBirth,
  placeOfIssue,
  expiryDate,
}: {
  userId: string;
  imageData: string;
  status: "PENDING" | "VERIFIED" | "RESUBMISSION_REQUESTED";
  type: string | null;
  placeOfBirth: string | null;
  placeOfIssue: string | null;
  expiryDate: Date | null;
}) {
  const meta = documentStatusMeta[status];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity document</CardTitle>
        <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="overflow-hidden rounded-xl border border-border bg-surface-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageData} alt="Submitted identity document" className="max-h-80 w-full object-contain" />
        </div>

        <ResubmitForm userId={userId} />

        <div className="border-t border-border pt-5">
          <DocumentDetailsForm
            userId={userId}
            type={type}
            placeOfBirth={placeOfBirth}
            placeOfIssue={placeOfIssue}
            expiryDate={expiryDate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
