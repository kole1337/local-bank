"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, clearSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { AuditAction, recordAudit, recordAuditForCurrentUser } from "@/lib/audit";

export type LoginState = {
  error?: string;
};

// Deliberately generic: we never disclose whether it was the email or the
// password that was wrong. Better UX signal for a real person, worse signal
// for someone probing which emails have accounts.
const INVALID_CREDENTIALS = "The details you entered are incorrect";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const rawEmail = String(formData.get("email") ?? "");

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    await recordAudit(AuditAction.LOGIN_FAILED, {
      actorEmail: rawEmail || null,
      detail: "Malformed sign-in submission",
    });
    return { error: INVALID_CREDENTIALS };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    await recordAudit(AuditAction.LOGIN_FAILED, {
      actorEmail: parsed.data.email,
      detail: "No account with that email",
    });
    return { error: INVALID_CREDENTIALS };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    await recordAudit(AuditAction.LOGIN_FAILED, {
      userId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      detail: "Incorrect password",
    });
    return { error: INVALID_CREDENTIALS };
  }

  await createSessionCookie({ userId: user.id, role: user.role });

  await recordAudit(AuditAction.LOGIN, {
    userId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    detail: `Application status: ${user.status}`,
  });

  redirect(user.role === "EMPLOYEE" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  await recordAuditForCurrentUser(AuditAction.LOGOUT);
  await clearSessionCookie();
  redirect("/");
}
