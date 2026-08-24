import { Logo } from "@/components/layout/Logo";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Card, CardContent } from "@/components/ui/Card";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <Logo className="mb-8" />
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-foreground">Open your Verdant Bank account</h1>
          <p className="mt-1 text-sm text-muted-foreground">It takes about two minutes.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <OnboardingWizard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
