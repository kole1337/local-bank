"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, clearSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return { error: "No account found with that email" };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Incorrect password" };
  }

  await createSessionCookie({ userId: user.id, role: user.role });

  redirect(user.role === "EMPLOYEE" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
