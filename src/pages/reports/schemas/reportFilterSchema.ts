import { z } from 'zod';
export const reportFilterSchema = z.object({
  branch: z.string().min(1, 'Select a branch'),
  fromDate: z.string().min(1, 'Choose a start date'),
  toDate: z.string().min(1, 'Choose an end date'),
  status: z.string().min(1, 'Select a status'),
  format: z.enum(['csv', 'xlsx']),
}).superRefine((value, ctx) => {
  if (value.fromDate && value.toDate && value.fromDate > value.toDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['toDate'], message: 'End date must be on or after start date' });
  }
});
export type ReportFilterValues = z.infer<typeof reportFilterSchema>;
