import Link from "next/link";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { LogoutButton } from "./LogoutButton";
import { Avatar } from "@/components/ui/Avatar";

export function CustomerHeader({
  name,
  notifications,
}: {
  name: string;
  notifications: {
    id: string;
    type: "APPROVAL" | "DECLINE" | "RESUBMISSION" | "GENERAL";
    message: string;
    read: boolean;
    createdAt: string | Date;
  }[];
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationBell notifications={notifications} />
          <LogoutButton className="hidden sm:flex" />
          <Link
            href="/profile"
            className="ml-1 rounded-full ring-offset-2 transition-shadow hover:ring-2 hover:ring-primary/30"
            aria-label="View profile"
          >
            <Avatar name={name} />
          </Link>
        </div>
      </div>
    </header>
  );
}
