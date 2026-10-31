export const requiredFields = ["customerNo", "customerName", "mobileNo", "email", "productType", "loanAmount", "totalIncome", "totalExpense", "status"] as const;
export const isValidRequest = (form: Record<string, string>) => requiredFields.every((key) => String(form[key] ?? '').trim().length > 0);
