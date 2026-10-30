import { z } from 'zod';

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Enter your current password'),
  newPassword: z.string()
    .min(8, 'Password must contain at least 8 characters')
    .max(64, 'Password must be 64 characters or fewer')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[a-z]/, 'Include at least one lowercase letter')
    .regex(/\d/, 'Include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Include at least one special character'),
  confirmPassword: z.string().min(1, 'Confirm your new password'),
}).refine((values) => values.newPassword !== values.oldPassword, {
  path: ['newPassword'], message: 'New password must be different from the current password',
}).refine((values) => values.newPassword === values.confirmPassword, {
  path: ['confirmPassword'], message: 'Passwords do not match',
});

export const passwordOtpSchema = z.object({ otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit OTP') });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type PasswordOtpFormValues = z.infer<typeof passwordOtpSchema>;
