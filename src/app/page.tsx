import { ArrowRight, BellRing, IdCard, LineChart, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LinkButton } from "@/components/ui/LinkButton";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
  {
    icon: IdCard,
    title: "Guided onboarding",
    description: "A simple two-step flow collects applicant details and identity documents.",
  },
  {
    icon: ShieldCheck,
    title: "Staff review workflow",
    description: "Bank staff verify identity documents and approve or decline applications.",
  },
  {
    icon: LineChart,
    title: "Account & transactions",
    description: "Customers track balances and transaction history in one clean dashboard.",
  },
  {
    icon: BellRing,
    title: "Real-time notifications",
    description: "Applicants are notified the moment their account is approved or declined.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <LinkButton href="/login" variant="ghost">
              Sign in
            </LinkButton>
            <LinkButton href="/onboarding">Open an account</LinkButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto mb-5 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Customer onboarding & account management
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Banking onboarding, built for speed and trust
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Verdant Bank is a demo portal that takes a customer from application to an approved,
              fully managed account — with a review workflow bank staff actually enjoy using.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton href="/onboarding" size="lg">
                Open an account
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/login" size="lg" variant="outline">
                Bank staff login
              </LinkButton>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-5">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6">
            <p className="text-sm font-medium text-foreground">Want to try both sides of the product?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in as staff with <span className="font-mono">employee@verdant.bank</span> / Password123!, or as a
              customer with <span className="font-mono">jordan@example.com</span> / Password123!
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Verdant Bank is a fictional portfolio demo — not a real financial institution.
      </footer>
    </div>
  );
}
