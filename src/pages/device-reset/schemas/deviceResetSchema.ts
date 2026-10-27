import { z } from 'zod';

export const deviceLookupSchema = z.object({
  customerNumber: z.string().trim().min(3, 'Enter a valid customer number').max(30, 'Customer number is too long'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
});
export const deviceResetSchema = z.object({
  reason: z.enum(['Lost or stolen phone', 'Changed phone', 'App not working', 'Other']),
});
export type DeviceLookupValues = z.infer<typeof deviceLookupSchema>;
export type DeviceResetValues = z.infer<typeof deviceResetSchema>;
