import type { BranchStatus } from '../types/branch';

export const BRANCH_PAGE_SIZE = 8;

export const BRANCH_STATUS_OPTIONS: Array<{
  value: BranchStatus | 'all';
  label: string;
}> = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const BRANCH_DETAILS_FIELDS = [
  { key: 'code', label: 'Branch Code' },
  { key: 'ifsc', label: 'IFSC Code' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'pincode', label: 'Pincode' },
  { key: 'phone', label: 'Branch Phone' },
  { key: 'customers', label: 'Customers' },
  { key: 'status', label: 'Status' },
] as const;
