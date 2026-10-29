import { z } from 'zod';
export const roleSchema = z.object({
  name: z.string().trim().min(2, 'Enter a role name').max(60, 'Role name must be 60 characters or fewer'),
  description: z.string().trim().min(10, 'Enter at least 10 characters').max(250, 'Description must be 250 characters or fewer'),
  status: z.enum(['Active', 'Inactive']),
});
export type RoleFormValues = z.infer<typeof roleSchema>;
