import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "danger";

const config: Record<Tone, { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "border-border bg-surface-muted text-foreground" },
  success: { icon: CheckCircle2, classes: "border-primary/20 bg-accent text-accent-foreground" },
  danger: { icon: AlertTriangle, classes: "border-danger/20 bg-danger-accent text-danger" },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, classes } = config[tone];
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4 text-sm", classes, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "mt-0.5 opacity-90")}>{children}</div>}
      </div>
    </div>
  );
}
