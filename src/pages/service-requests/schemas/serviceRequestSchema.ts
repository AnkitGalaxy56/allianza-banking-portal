import { z } from 'zod';
export const serviceRequestUpdateSchema = z.object({
  status: z.enum(['new', 'in_review', 'completed', 'rejected']),
  note: z.string().trim().max(500, 'Note must be 500 characters or fewer'),
});
export type ServiceRequestUpdateValues = z.infer<typeof serviceRequestUpdateSchema>;
