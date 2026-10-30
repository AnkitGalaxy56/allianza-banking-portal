export const requiredFields = ["branch", "requestDate", "debitAccount", "debitStatus", "debitName", "debitAmount", "tenure", "frequency", "expiryDate", "creditAccount", "creditStatus", "creditName"] as const;
export const isValidRequest = (form: Record<string, string>) => requiredFields.every((key) => String(form[key] ?? '').trim().length > 0);
