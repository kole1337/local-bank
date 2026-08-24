export const applicationStatusMeta = {
  PENDING: { label: "Pending review", tone: "warning" as const },
  APPROVED: { label: "Approved", tone: "positive" as const },
  DECLINED: { label: "Declined", tone: "negative" as const },
};

export const documentStatusMeta = {
  PENDING: { label: "Awaiting review", tone: "warning" as const },
  VERIFIED: { label: "Verified", tone: "positive" as const },
  RESUBMISSION_REQUESTED: { label: "Resubmission requested", tone: "negative" as const },
};

export const documentTypeLabels: Record<string, string> = {
  PASSPORT: "Passport",
  NATIONAL_ID: "National ID card",
  DRIVERS_LICENSE: "Driver's license",
};

export const transactionTypeMeta = {
  DEPOSIT: { label: "Deposit", direction: "in" as const },
  WITHDRAWAL: { label: "Withdrawal", direction: "out" as const },
  TRANSFER_IN: { label: "Transfer received", direction: "in" as const },
  TRANSFER_OUT: { label: "Transfer sent", direction: "out" as const },
  PAYMENT: { label: "Payment", direction: "out" as const },
};
