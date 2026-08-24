import { Calendar, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

export function DetailsCard({
  name,
  dateOfBirth,
  address,
  email,
}: {
  name: string;
  dateOfBirth: Date;
  address: string;
  email: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicant details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Row icon={User} label="Full name" value={name} />
        <Row icon={Calendar} label="Date of birth" value={formatDate(dateOfBirth)} />
        <Row icon={MapPin} label="Address" value={address} />
        <div className="pt-1 text-xs text-muted-foreground">{email}</div>
      </CardContent>
    </Card>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
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
