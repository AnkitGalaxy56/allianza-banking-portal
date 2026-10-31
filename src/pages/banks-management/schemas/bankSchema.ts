import { z } from 'zod';

const optionalText = z.string().trim();
const optionalPincode = optionalText.refine((value) => !value || /^\d{6}$/.test(value), 'Enter a valid 6-digit pincode');
const optionalIfsc = optionalText.refine((value) => !value || /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value), 'Enter a valid 11-character IFSC code');
const optionalPan = optionalText.refine((value) => !value || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.toUpperCase()), 'Enter a valid PAN number');
const optionalGst = optionalText.refine((value) => !value || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value.toUpperCase()), 'Enter a valid GSTIN');

export const bankSchema = z.object({
  code: z.string().trim().min(1, 'Bank Code is required').max(20, 'Bank Code must be 20 characters or fewer'),
  name: z.string().trim().min(2, 'Bank Name must be at least 2 characters').max(100, 'Bank Name must be 100 characters or fewer'),
  type: optionalText, sponsorBank: optionalText, pan: optionalPan, cutOffTimings: optionalText,
  branches: optionalText.refine((value) => !value || (/^\d+$/.test(value) && Number(value) >= 0), 'Branches must be a non-negative whole number'),
  address: optionalText, address1: optionalText, address2: optionalText, address3: optionalText,
  city: optionalText, state: optionalText, pincode: optionalPincode, sponsorAccountId: optionalText,
  registrationLicense: optionalText, ifsc: optionalIfsc, gst: optionalGst, workingFrom: optionalText, workingTo: optionalText, micr: optionalText,
}).superRefine((value, ctx) => {
  if (value.workingFrom && value.workingTo && value.workingTo <= value.workingFrom) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['workingTo'], message: 'Working end time must be after start time' });
  }
});
export type BankValues = z.infer<typeof bankSchema>;
