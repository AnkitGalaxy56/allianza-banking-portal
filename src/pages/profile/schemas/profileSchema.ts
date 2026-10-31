import { z } from 'zod';

export const profileSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email address').email('Enter a valid email address').max(120, 'Email address is too long'),
  mobile: z.string().trim().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
