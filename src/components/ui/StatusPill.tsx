import { cn } from "@/lib/utils";

type Tone = "positive" | "neutral" | "negative" | "warning";

const toneClasses: Record<Tone, string> = {
  positive: "bg-accent text-accent-foreground",
  neutral: "bg-surface-muted text-muted-foreground",
  negative: "bg-danger-accent text-danger",
  warning: "bg-warning-accent text-warning-foreground",
};

export function StatusPill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
