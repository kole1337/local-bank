import { RefreshCcw } from "lucide-react";
import { requestResubmissionAction } from "@/lib/actions/applications";
import { Button } from "@/components/ui/Button";

export function ResubmitForm({ userId }: { userId: string }) {
  return (
    <form action={requestResubmissionAction.bind(null, userId)}>
      <Button type="submit" variant="outline" size="sm">
        <RefreshCcw className="h-3.5 w-3.5" />
        Request resubmission
      </Button>
    </form>
  );
}
