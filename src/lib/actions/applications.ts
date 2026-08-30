"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { declineSchema, documentUpdateSchema } from "@/lib/validators";
import { AuditAction, recordAuditForCurrentUser } from "@/lib/audit";

async function describeTarget(userId: string): Promise<string> {
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  return target ? `${target.name} (${target.email})` : userId;
}

async function requireEmployee() {
  const session = await getSession();
  if (!session || session.role !== "EMPLOYEE") {
    redirect("/login");
  }
  return session;
}

export async function approveApplicationAction(userId: string) {
  await requireEmployee();

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { status: "APPROVED", declineReason: null } }),
    prisma.notification.create({
      data: {
        userId,
        type: "APPROVAL",
        message: "Great news — your Verdant Bank account has been approved. Welcome aboard!",
      },
    }),
  ]);

  await recordAuditForCurrentUser(
    AuditAction.APPLICATION_APPROVED,
    `Approved ${await describeTarget(userId)}`,
  );

  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  redirect("/admin");
}

export type DeclineState = { error?: string };

export async function declineApplicationAction(
  userId: string,
  _prevState: DeclineState,
  formData: FormData,
): Promise<DeclineState> {
  await requireEmployee();

  const parsed = declineSchema.safeParse({ reason: formData.get("reason") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a reason" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { status: "DECLINED", declineReason: parsed.data.reason },
    }),
    prisma.notification.create({
      data: {
        userId,
        type: "DECLINE",
        message: `Your application was declined. Reason: ${parsed.data.reason}`,
      },
    }),
  ]);

  await recordAuditForCurrentUser(
    AuditAction.APPLICATION_DECLINED,
    `Declined ${await describeTarget(userId)} — reason: ${parsed.data.reason}`,
  );

  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  redirect("/admin");
}

export async function requestResubmissionAction(userId: string) {
  await requireEmployee();

  await prisma.$transaction([
    prisma.identityDocument.update({
      where: { userId },
      data: { status: "RESUBMISSION_REQUESTED" },
    }),
    prisma.notification.create({
      data: {
        userId,
        type: "RESUBMISSION",
        message: "We need a clearer photo of your ID document. Please log in and resubmit it.",
      },
    }),
  ]);

  await recordAuditForCurrentUser(
    AuditAction.RESUBMISSION_REQUESTED,
    `Requested a new ID document from ${await describeTarget(userId)}`,
  );

  revalidatePath(`/admin/review/${userId}`);
}

export type DocumentUpdateState = { error?: string; success?: boolean };

export async function updateDocumentDetailsAction(
  userId: string,
  _prevState: DocumentUpdateState,
  formData: FormData,
): Promise<DocumentUpdateState> {
  await requireEmployee();

  const parsed = documentUpdateSchema.safeParse({
    type: formData.get("type"),
    placeOfBirth: formData.get("placeOfBirth"),
    placeOfIssue: formData.get("placeOfIssue"),
    expiryDate: formData.get("expiryDate"),
  });

  if (!parsed.success) {
    return { error: "Check the document details and try again" };
  }

  await prisma.identityDocument.update({
    where: { userId },
    data: {
      type: parsed.data.type ? parsed.data.type : null,
      placeOfBirth: parsed.data.placeOfBirth || null,
      placeOfIssue: parsed.data.placeOfIssue || null,
      expiryDate: parsed.data.expiryDate ? new Date(parsed.data.expiryDate) : null,
      status: "VERIFIED",
    },
  });

  await recordAuditForCurrentUser(
    AuditAction.DOCUMENT_VERIFIED,
    `Verified the identity document for ${await describeTarget(userId)}`,
  );

  revalidatePath(`/admin/review/${userId}`);
  return { success: true };
}

export async function resubmitIdentityImageAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") {
    redirect("/login");
  }

  const idImage = formData.get("idImage");
  if (!(idImage instanceof File) || idImage.size === 0 || !idImage.type.startsWith("image/")) {
    redirect("/dashboard?error=invalid-image");
  }

  const buffer = Buffer.from(await (idImage as File).arrayBuffer());
  const imageData = `data:${(idImage as File).type};base64,${buffer.toString("base64")}`;

  await prisma.identityDocument.update({
    where: { userId: session.userId },
    data: { imageData, status: "PENDING" },
  });

  await recordAuditForCurrentUser(AuditAction.IDENTITY_RESUBMITTED);

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  redirect("/profile");
}
