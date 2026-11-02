import { z } from 'zod';

export const requestsReportFilterSchema = z.object({
  search: z.string(),
  branch: z.string(),
  status: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
}).superRefine((value, ctx) => {
  if (value.fromDate && value.toDate && value.fromDate > value.toDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['toDate'], message: 'End date must be on or after start date' });
  }
});
export type RequestsReportFilterValues = z.infer<typeof requestsReportFilterSchema>;
