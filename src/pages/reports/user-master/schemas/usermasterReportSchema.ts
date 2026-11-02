import { z } from 'zod';

export const usermasterReportFilterSchema = z.object({
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
export type UserMasterReportFilterValues = z.infer<typeof usermasterReportFilterSchema>;
