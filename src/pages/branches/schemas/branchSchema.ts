import { z } from 'zod';
import type { Branch } from '../types/branch';

export const branchSchema = z.object({
  name: z.string().trim().min(2, 'Enter the branch name'),
  code: z.string().trim().min(2, 'Enter a unique branch code').max(12, 'Max 12 characters'),
  ifsc: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/, 'Enter a valid 11-character IFSC'),
  address: z.string().trim().min(3, 'Enter the street / area'),
  city: z.string().trim().min(2, 'Enter the city'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a 6-digit pincode'),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, 'Enter a valid phone number'),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

export const EMPTY_BRANCH: BranchFormValues = {
  name: '',
  code: '',
  ifsc: '',
  address: '',
  city: '',
  pincode: '',
  phone: '',
};

export const branchToFormValues = (b: Branch): BranchFormValues => ({
  name: b.name,
  code: b.code,
  ifsc: b.ifsc,
  address: b.address,
  city: b.city,
  pincode: b.pincode,
  phone: b.phone,
});
