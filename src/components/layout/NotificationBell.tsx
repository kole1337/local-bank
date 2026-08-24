"use client";

import { Bell, CheckCheck, CircleCheck, CircleX, RefreshCcw, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { markAllNotificationsReadAction } from "@/lib/actions/notifications";

type NotificationItem = {
  id: string;
  type: "APPROVAL" | "DECLINE" | "RESUBMISSION" | "GENERAL";
  message: string;
  read: boolean;
  createdAt: string | Date;
};

const iconByType = {
  APPROVAL: CircleCheck,
  DECLINE: CircleX,
  RESUBMISSION: RefreshCcw,
  GENERAL: Info,
};

export function NotificationBell({ notifications }: { notifications: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 w-80 rounded-2xl border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <form action={markAllNotificationsReadAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              </form>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No notifications yet</p>
            ) : (
              notifications.map((n) => {
                const Icon = iconByType[n.type];
                return (
                  <div
                    key={n.id}
                    className="flex gap-3 border-b border-border p-4 last:border-b-0"
                  >
                    <Icon
                      className={
                        "mt-0.5 h-4 w-4 shrink-0 " +
                        (n.type === "APPROVAL"
                          ? "text-primary"
                          : n.type === "DECLINE"
                            ? "text-danger"
                            : "text-muted-foreground")
                      }
                    />
                    <div>
                      <p className={"text-sm " + (n.read ? "text-muted-foreground" : "text-foreground font-medium")}>
                        {n.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
