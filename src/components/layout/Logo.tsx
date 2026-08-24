import { Landmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-semibold text-foreground", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Landmark className="h-5 w-5" />
      </span>
      <span className="text-[15px] tracking-tight">Verdant Bank</span>
    </Link>
  );
}
