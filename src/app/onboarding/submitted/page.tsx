import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LinkButton } from "@/components/ui/LinkButton";

export default function OnboardingSubmittedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <Logo className="mb-8" />
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h1 className="text-xl font-semibold text-foreground">Application submitted</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Thanks for applying to Verdant Bank. Our team will review your details and identity document, and
        we&apos;ll notify you as soon as a decision is made.
      </p>
      <LinkButton href="/login" className="mt-6">
        Sign in to check your status
      </LinkButton>
    </div>
  );
}
