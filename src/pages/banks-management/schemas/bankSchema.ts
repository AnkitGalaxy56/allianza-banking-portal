import { z } from 'zod';

export const bankSchema = z.object({
  code: z.string().trim().min(1, 'Bank Code is required'), name: z.string().trim().min(1, 'Bank Name is required'),
  type: z.string(), sponsorBank: z.string(), pan: z.string(), cutOffTimings: z.string(), branches: z.string(), address: z.string(), address1: z.string(), address2: z.string(), address3: z.string(), city: z.string(), state: z.string(), pincode: z.string(), sponsorAccountId: z.string(), registrationLicense: z.string(), ifsc: z.string(), gst: z.string(), workingFrom: z.string(), workingTo: z.string(), micr: z.string(),
});
export type BankValues = z.infer<typeof bankSchema>;
