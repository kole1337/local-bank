import { CircleCheck } from "lucide-react";
import { approveApplicationAction } from "@/lib/actions/applications";
import { Button } from "@/components/ui/Button";

export function ApproveForm({ userId }: { userId: string }) {
  return (
    <form action={approveApplicationAction.bind(null, userId)}>
      <Button type="submit">
        <CircleCheck className="h-4 w-4" />
        Approve application
      </Button>
    </form>
  );
}
