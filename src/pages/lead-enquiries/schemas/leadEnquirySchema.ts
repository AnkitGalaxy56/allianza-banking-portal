import { z } from 'zod';
export const leadEnquiryUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
  internalNote: z.string().trim().max(1000, 'Internal note must be 1,000 characters or fewer'),
});
export type LeadEnquiryUpdateValues = z.infer<typeof leadEnquiryUpdateSchema>;
