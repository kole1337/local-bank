"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, IdCard, ImagePlus, User } from "lucide-react";
import { submitOnboardingAction, type OnboardingState } from "@/lib/actions/onboarding";
import { onboardingDetailsSchema } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldGroup, Input, Label } from "@/components/ui/Field";

const initialState: OnboardingState = {};
const STEP1_KEYS = ["name", "dateOfBirth", "email", "address", "password", "confirmPassword"] as const;

export function OnboardingWizard() {
  const [step, setStep] = useState<1 | 2>(1);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(submitOnboardingAction, initialState);

  const [handledErrors, setHandledErrors] = useState(state.errors);
  if (state.errors !== handledErrors) {
    setHandledErrors(state.errors);
    if (state.errors && STEP1_KEYS.some((k) => state.errors?.[k])) {
      setStep(1);
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const errors = { ...state.errors, ...clientErrors };

  function handleNext() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const parsed = onboardingDetailsSchema.safeParse({
      name: fd.get("name"),
      dateOfBirth: fd.get("dateOfBirth"),
      email: fd.get("email"),
      address: fd.get("address"),
      password: fd.get("password"),
      confirmPassword: fd.get("confirmPassword"),
    });

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setClientErrors(nextErrors);
      return;
    }

    setClientErrors({});
    setStep(2);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <ol className="flex items-center gap-3">
        <StepDot icon={User} active={step === 1} done={step > 1} label="Your details" />
        <div className="h-px flex-1 bg-border" />
        <StepDot icon={IdCard} active={step === 2} done={false} label="Identity" />
      </ol>

      <div className={step === 1 ? "space-y-4" : "hidden"}>
        <FieldGroup>
          <Label htmlFor="name">Full legal name</Label>
          <Input id="name" name="name" placeholder="Jordan Alvarez" defaultValue={state.values?.name} required />
          <FieldError>{errors.name}</FieldError>
        </FieldGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={state.values?.dateOfBirth} required />
            <FieldError>{errors.dateOfBirth}</FieldError>
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" defaultValue={state.values?.email} required />
            <FieldError>{errors.email}</FieldError>
          </FieldGroup>
        </div>

        <FieldGroup>
          <Label htmlFor="address">Home address</Label>
          <Input id="address" name="address" placeholder="123 Elm Street, Springfield" defaultValue={state.values?.address} required />
          <FieldError>{errors.address}</FieldError>
        </FieldGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="password">Create a password</Label>
            <Input id="password" name="password" type="password" required />
            <FieldError>{errors.password}</FieldError>
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
            <FieldError>{errors.confirmPassword}</FieldError>
          </FieldGroup>
        </div>

        <Button type="button" className="w-full" onClick={handleNext}>
          Continue to identity verification
        </Button>
      </div>

      <div className={step === 2 ? "space-y-4" : "hidden"}>
        <FieldGroup>
          <Label htmlFor="idImage">Photo of a government-issued ID</Label>
          <label
            htmlFor="idImage"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-muted px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="ID preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Click to upload a photo</p>
                <p className="text-xs text-muted-foreground">Passport, national ID, or driver&apos;s license · PNG or JPG, up to 5MB</p>
              </>
            )}
          </label>
          <input
            id="idImage"
            name="idImage"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
          <FieldError>{errors.idImage}</FieldError>
        </FieldGroup>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? "Submitting…" : "Submit application"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function StepDot({
  icon: Icon,
  active,
  done,
  label,
}: {
  icon: typeof User;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={
          "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold " +
          (done
            ? "border-primary bg-primary text-primary-foreground"
            : active
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-surface text-muted-foreground")
        }
      >
        {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </span>
      <span className={"text-sm font-medium " + (active || done ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </li>
  );
}
