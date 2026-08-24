"use client";

import { useActionState, useState } from "react";
import { CircleX } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldGroup, Label, Textarea } from "@/components/ui/Field";
import { declineApplicationAction, type DeclineState } from "@/lib/actions/applications";

const initialState: DeclineState = {};

export function DeclineDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    declineApplicationAction.bind(null, userId),
    initialState,
  );

  return (
    <>
      <Button variant="danger-outline" onClick={() => setOpen(true)}>
        <CircleX className="h-4 w-4" />
        Decline
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Decline this application"
        description="The applicant will be notified with the reason you provide."
      >
        <form action={formAction} className="space-y-4">
          <FieldGroup>
            <Label htmlFor="reason">Reason for declining</Label>
            <Textarea id="reason" name="reason" placeholder="e.g. The ID photo does not match the details provided." required />
            <FieldError>{state.error}</FieldError>
          </FieldGroup>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={pending}>
              {pending ? "Declining…" : "Decline application"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
