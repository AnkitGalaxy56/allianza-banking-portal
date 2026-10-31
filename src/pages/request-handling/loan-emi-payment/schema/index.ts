export const requiredFields = ["branch", "debitAccount", "debitStatus", "debitName", "currentBalance", "debitAmount", "creditAccount", "creditStatus", "creditName", "outstanding", "interestOutstanding", "expiryDate", "instalmentAmount"] as const;
export const isValidRequest = (form: Record<string, string>) => requiredFields.every((key) => String(form[key] ?? '').trim().length > 0);
