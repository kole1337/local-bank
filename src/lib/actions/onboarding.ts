"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { onboardingDetailsSchema } from "@/lib/validators";
import { generateAccountNumber } from "@/lib/utils";

export type OnboardingState = {
  errors?: Partial<Record<"name" | "dateOfBirth" | "email" | "address" | "password" | "confirmPassword" | "idImage", string>>;
  values?: Record<string, string>;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function submitOnboardingAction(
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = onboardingDetailsSchema.safeParse(raw);
  const values = { name: raw.name, dateOfBirth: raw.dateOfBirth, email: raw.email, address: raw.address };

  if (!parsed.success) {
    const errors: OnboardingState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<OnboardingState["errors"]>;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { errors, values };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { errors: { email: "An account with this email already exists" }, values };
  }

  const idImage = formData.get("idImage");
  if (!(idImage instanceof File) || idImage.size === 0) {
    return { errors: { idImage: "Upload a photo of your ID document" }, values };
  }
  if (!idImage.type.startsWith("image/")) {
    return { errors: { idImage: "The uploaded file must be an image" }, values };
  }
  if (idImage.size > MAX_IMAGE_BYTES) {
    return { errors: { idImage: "Image must be smaller than 5MB" }, values };
  }

  const buffer = Buffer.from(await idImage.arrayBuffer());
  const imageData = `data:${idImage.type};base64,${buffer.toString("base64")}`;

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      dateOfBirth: new Date(parsed.data.dateOfBirth),
      address: parsed.data.address,
      passwordHash,
      role: "CUSTOMER",
      status: "PENDING",
      account: {
        create: {
          accountNumber: generateAccountNumber(),
          balanceCents: 0,
        },
      },
      document: {
        create: {
          imageData,
          status: "PENDING",
        },
      },
    },
  });

  redirect("/onboarding/submitted");
}
