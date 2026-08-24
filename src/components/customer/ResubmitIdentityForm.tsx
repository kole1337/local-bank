"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { resubmitIdentityImageAction } from "@/lib/actions/applications";

export function ResubmitIdentityForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setFileSelected(Boolean(file));
  }

  return (
    <form action={resubmitIdentityImageAction} className="space-y-4">
      <label
        htmlFor="idImage"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-muted px-6 py-8 text-center transition-colors hover:border-primary/40 hover:bg-accent/40"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="New ID preview" className="max-h-40 rounded-lg object-contain" />
        ) : (
          <>
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Upload a new photo of your ID</p>
          </>
        )}
      </label>
      <input id="idImage" name="idImage" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
      <Button type="submit" className="w-full" disabled={!fileSelected}>
        Submit new document
      </Button>
    </form>
  );
}
