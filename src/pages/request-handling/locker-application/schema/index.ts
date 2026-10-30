export const requiredFields = ["customerNo", "customerName", "mobileNo", "email", "branch", "lockerType", "operationMode"] as const;
export const isValidRequest = (form: Record<string, string>) => requiredFields.every((key) => String(form[key] ?? '').trim().length > 0);
