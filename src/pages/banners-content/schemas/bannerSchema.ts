import { z } from 'zod';

export const announcementSchema = z.object({
  scope: z.string().min(1, 'Select where this announcement should appear'),
  heading: z.string().trim().min(3, 'Heading must be at least 3 characters').max(60, 'Heading must be 60 characters or fewer'),
  text: z.string().trim().min(5, 'Announcement text must be at least 5 characters').max(500, 'Text must be 500 characters or fewer'),
  start: z.string().optional(),
  end: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.start && value.end && value.end < value.start) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['end'], message: 'End date must be on or after start date' });
  }
});
export type AnnouncementValues = z.infer<typeof announcementSchema>;
