import { z } from "zod";

export const onboardingDetailsSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    dateOfBirth: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date"),
    email: z.string().trim().email("Enter a valid email"),
    address: z.string().trim().min(5, "Enter your full address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type OnboardingDetailsInput = z.infer<typeof onboardingDetailsSchema>;

export const onboardingIdentitySchema = z.object({
  imageData: z.string().startsWith("data:image/", "Upload a valid image file"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const documentTypeValues = ["PASSPORT", "NATIONAL_ID", "DRIVERS_LICENSE"] as const;

export const documentUpdateSchema = z.object({
  type: z.enum(documentTypeValues).optional().or(z.literal("")),
  placeOfBirth: z.string().trim().optional(),
  placeOfIssue: z.string().trim().optional(),
  expiryDate: z.string().optional(),
});

export const declineSchema = z.object({
  reason: z.string().trim().min(3, "Give a short reason for the customer"),
});
