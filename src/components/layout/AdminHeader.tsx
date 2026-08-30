"use client";

import { ClipboardList, ScrollText, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";

export function AdminHeader() {
  const pathname = usePathname();
  const active = pathname.startsWith("/admin/customers")
    ? "customers"
    : pathname.startsWith("/admin/activity")
      ? "activity"
      : "applications";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo href="/admin" />
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/admin"
              className={
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (active === "applications"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground")
              }
            >
              <ClipboardList className="h-4 w-4" />
              Applications
            </Link>
            <Link
              href="/admin/customers"
              className={
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (active === "customers"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground")
              }
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/admin/activity"
              className={
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (active === "activity"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground")
              }
            >
              <ScrollText className="h-4 w-4" />
              Activity
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-medium uppercase tracking-wide text-muted-foreground sm:block">
            Staff portal
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
