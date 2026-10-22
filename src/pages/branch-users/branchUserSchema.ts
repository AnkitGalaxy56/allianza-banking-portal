import { z } from 'zod';

export const branchUserSchema = z.object({
  name: z.string().trim().min(2, 'Enter the full name').max(100, 'Name is too long'),
  email: z.string().trim().email('Enter a valid email address'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a 10-digit mobile number'),
  branchId: z.string().min(1, 'Select a branch'),
  role: z.enum(['Manager', 'Officer'], { required_error: 'Select a role' }),
  sendLoginEmail: z.boolean(),
});

export type BranchUserFormValues = z.infer<typeof branchUserSchema>;

export const EMPTY_BRANCH_USER: BranchUserFormValues = {
  name: '',
  email: '',
  mobile: '',
  branchId: '',
  role: 'Officer',
  sendLoginEmail: true,
};
