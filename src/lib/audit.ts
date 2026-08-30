import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * Human-readable action labels. These strings are shown verbatim in the staff
 * activity log, so keep them short and past-tense ("Logged in", "Approved
 * application").
 */
export const AuditAction = {
  LOGIN: "Logged in",
  LOGIN_FAILED: "Failed login attempt",
  LOGOUT: "Logged out",
  APPLICATION_SUBMITTED: "Submitted application",
  APPLICATION_RESUBMITTED: "Re-submitted application",
  APPLICATION_APPROVED: "Approved application",
  APPLICATION_DECLINED: "Declined application",
  RESUBMISSION_REQUESTED: "Requested document resubmission",
  DOCUMENT_VERIFIED: "Verified identity document",
  IDENTITY_RESUBMITTED: "Resubmitted identity document",
  NOTIFICATIONS_READ: "Marked notifications as read",
  VIEWED_CUSTOMER: "Opened customer account",
  VIEWED_APPLICATION: "Opened application review",
  VIEWED_ACTIVITY_LOG: "Viewed activity log",
} as const;

export type AuditActionValue = (typeof AuditAction)[keyof typeof AuditAction];

type Actor = {
  userId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
};

function parseUserAgent(ua: string | null): { device: string; browser: string } {
  if (!ua) return { device: "Unknown device", browser: "Unknown browser" };

  const device = /iPad/i.test(ua)
    ? "Tablet (iPad)"
    : /Mobile|iPhone|Android.*Mobile/i.test(ua)
      ? "Mobile"
      : /Android/i.test(ua)
        ? "Tablet (Android)"
        : /Windows NT/i.test(ua)
          ? "Desktop (Windows)"
          : /Macintosh|Mac OS X/i.test(ua)
            ? "Desktop (macOS)"
            : /Linux/i.test(ua)
              ? "Desktop (Linux)"
              : "Desktop";

  const browser = /Edg\//i.test(ua)
    ? "Edge"
    : /OPR\/|Opera/i.test(ua)
      ? "Opera"
      : /Firefox\//i.test(ua)
        ? "Firefox"
        : /Chrome\//i.test(ua) && !/Chromium/i.test(ua)
          ? "Chrome"
          : /Safari\//i.test(ua) && !/Chrome/i.test(ua)
            ? "Safari"
            : "Unknown browser";

  return { device, browser };
}

/**
 * Next.js signals redirects, `notFound()`, and dynamic-rendering bailouts by
 * throwing errors that carry a `digest`. Those must never be swallowed by our
 * best-effort logging try/catch — re-throw them.
 */
function rethrowIfFrameworkError(error: unknown): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string"
  ) {
    throw error;
  }
}

async function requestMeta() {
  const h = await headers();
  const ua = h.get("user-agent");
  const forwardedFor = h.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "127.0.0.1 (local)";
  return { ua, ip, ...parseUserAgent(ua) };
}

/**
 * Record an audit entry. Never throws — a logging failure must not break the
 * action being logged.
 */
export async function recordAudit(
  action: AuditActionValue,
  options: { detail?: string } & Actor = {},
): Promise<void> {
  try {
    const { ua, ip, device, browser } = await requestMeta();
    const data = {
      action,
      detail: options.detail ?? null,
      userId: options.userId ?? null,
      actorEmail: options.actorEmail ?? null,
      actorRole: options.actorRole ?? null,
      ipAddress: ip,
      userAgent: ua ?? null,
      device,
      browser,
    };
    try {
      await prisma.auditLog.create({ data });
    } catch (error) {
      rethrowIfFrameworkError(error);
      // Most likely a stale userId (foreign key). Keep the entry, drop the link.
      if (data.userId) {
        await prisma.auditLog.create({ data: { ...data, userId: null } });
      } else {
        throw error;
      }
    }
  } catch (error) {
    rethrowIfFrameworkError(error);
    console.error(`[audit] failed to record "${action}":`, error);
  }
}

/**
 * Record an audit entry attributed to the currently signed-in user, resolving
 * their email/role from the session.
 */
export async function recordAuditForCurrentUser(
  action: AuditActionValue,
  detail?: string,
): Promise<void> {
  try {
    const session = await getSession();
    // The session cookie can outlive the row it points at (e.g. the database was
    // re-seeded). Only attribute the log to a userId that actually exists, so we
    // never trip the foreign key.
    let user: { email: string } | null = null;
    if (session) {
      user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { email: true },
      });
    }
    await recordAudit(action, {
      detail,
      userId: user ? session?.userId ?? null : null,
      actorEmail: user?.email ?? null,
      actorRole: session?.role ?? null,
    });
  } catch (error) {
    rethrowIfFrameworkError(error);
    console.error(`[audit] failed to record "${action}" for current user:`, error);
  }
}
