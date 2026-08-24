import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Logo className="mb-8" />
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <h1 className="text-lg font-semibold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your Verdant Bank account.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/onboarding" className="font-medium text-primary hover:text-primary-hover">
              Open an account
            </Link>
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 w-full max-w-sm rounded-xl border border-dashed border-border bg-surface-muted p-4 text-xs text-muted-foreground">
        <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
          <KeyRound className="h-3.5 w-3.5" />
          Demo credentials
        </p>
        <p>Bank staff: employee@verdant.bank / Password123!</p>
        <p>Customer: jordan@example.com / Password123!</p>
      </div>
    </div>
  );
}
