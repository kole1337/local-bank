"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldGroup, Input, Label, Select } from "@/components/ui/Field";
import { updateDocumentDetailsAction, type DocumentUpdateState } from "@/lib/actions/applications";
import { toDateInputValue } from "@/lib/utils";

const initialState: DocumentUpdateState = {};

const documentTypeOptions = [
  { value: "", label: "Select a document type" },
  { value: "PASSPORT", label: "Passport" },
  { value: "NATIONAL_ID", label: "National ID card" },
  { value: "DRIVERS_LICENSE", label: "Driver's license" },
];

export function DocumentDetailsForm({
  userId,
  type,
  placeOfBirth,
  placeOfIssue,
  expiryDate,
}: {
  userId: string;
  type: string | null;
  placeOfBirth: string | null;
  placeOfIssue: string | null;
  expiryDate: Date | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateDocumentDetailsAction.bind(null, userId),
    initialState,
  );
  const [selectedType, setSelectedType] = useState(type ?? "");

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="type">Document type</Label>
          <Select
            id="type"
            name="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {documentTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="expiryDate">Document expiry date</Label>
          <Input id="expiryDate" name="expiryDate" type="date" defaultValue={toDateInputValue(expiryDate)} />
        </FieldGroup>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="placeOfBirth">Place of birth</Label>
          <Input id="placeOfBirth" name="placeOfBirth" placeholder="City, Country" defaultValue={placeOfBirth ?? ""} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="placeOfIssue">Place of issue</Label>
          <Input id="placeOfIssue" name="placeOfIssue" placeholder="City, Country" defaultValue={placeOfIssue ?? ""} />
        </FieldGroup>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? "Saving…" : "Save document details"}
        </Button>
        {state.success && <span className="text-xs font-medium text-primary">Saved</span>}
        {state.error && <span className="text-xs font-medium text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
