import { z } from 'zod';

export const pushNotificationSchema = z.object({
  branch: z.string().min(1, 'Select a branch'),
  audience: z.string().min(1, 'Select an audience'),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(80, 'Title must be 80 characters or fewer'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(500, 'Message must be 500 characters or fewer'),
  schedule: z.enum(['now', 'scheduled']),
  dateTime: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.schedule === 'scheduled' && !value.dateTime) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dateTime'], message: 'Choose a date and time for scheduled delivery' });
  }
});
export type PushNotificationFormValues = z.infer<typeof pushNotificationSchema>;
