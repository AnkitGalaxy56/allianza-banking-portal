import type { SelectOption } from '@/components/form/FormSelectField';

export const BRANCHES = [
  { id: 'br-001', name: 'Main branch' },
  { id: 'br-002', name: 'Branch 2' },
  { id: 'br-003', name: 'Branch 3' },
  { id: 'br-004', name: 'Branch 4' },
  { id: 'br-005', name: 'Branch 5' },
  { id: 'br-006', name: 'Branch 6' },
  { id: 'br-007', name: 'Branch 7' },
  { id: 'br-008', name: 'Branch 8' },
];

export const BRANCH_OPTIONS: SelectOption[] = BRANCHES.map((branch) => ({
  value: branch.id,
  label: branch.name,
}));

export const TITLE_OPTIONS: SelectOption[] = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Ms', label: 'Ms' },
];

export const USER_ROLE_OPTIONS: SelectOption[] = [
  { value: 'Manager', label: 'Manager' },
  { value: 'Officer', label: 'Officer' },
];

export const SYSTEM_ROLE_OPTIONS: SelectOption[] = [
  { value: 'Branch Administrator', label: 'Branch Administrator' },
  { value: 'Branch Manager', label: 'Branch Manager' },
  { value: 'Branch Officer', label: 'Branch Officer' },
  { value: 'Auditor', label: 'Auditor' },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Invited', label: 'Invited' },
  { value: 'Locked', label: 'Locked' },
];

export const TWO_FACTOR_DESIGNATION_OPTIONS: SelectOption[] = [
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'Not Applicable', label: 'Not Applicable' },
];

export const TWO_FACTOR_OPTIONS: SelectOption[] = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export const AUTHENTICATION_OPTIONS: SelectOption[] = [
  { value: 'Password', label: 'Password' },
  { value: 'OTP', label: 'OTP' },
  { value: 'Password + OTP', label: 'Password + OTP' },
  { value: 'Authenticator App', label: 'Authenticator App' },
];
