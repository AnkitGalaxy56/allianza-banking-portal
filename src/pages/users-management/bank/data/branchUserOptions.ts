import type { SelectOption } from '@/components/form/FormSelectField';

export const BRANCHES = [
  { id: 'ALZ001', name: 'Main Branch' },
  { id: 'ALZ002', name: 'Branch 2' },
  { id: 'ALZ003', name: 'Branch 3' },
  { id: 'ALZ004', name: 'Branch 4' },
  { id: 'ALZ005', name: 'Branch 5' },
  { id: 'ALZ006', name: 'Branch 6' },
  { id: 'ALZ007', name: 'Branch 7' },
  { id: 'ALZ008', name: 'Branch 8' },
];

export const BRANCH_OPTIONS: SelectOption[] = BRANCHES.map((branch) => ({
  value: branch.id,
  label: branch.name,
}));

export const TITLE_OPTIONS: SelectOption[] = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Dr', label: 'Dr' },
];

export const USER_ROLE_OPTIONS: SelectOption[] = [
  { value: 'Bank User', label: 'Bank User' },
  { value: 'Bank Admin', label: 'Bank Admin' },
  { value: 'Super Admin', label: 'Super Admin' },
];

export const SYSTEM_ROLE_OPTIONS: SelectOption[] = [
  { value: 'Checker', label: 'Checker' },
  { value: 'Maker', label: 'Maker' },
  { value: 'Admin', label: 'Admin' },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { value: 'Entered', label: '001 - Entered' },
  { value: 'Operative', label: '002 - Operative' },
  { value: 'In-Operative', label: '003 - In-Operative' },
  { value: 'Suspended', label: '004 - Suspended' },
  { value: 'Password Blocked', label: '005 - Password Blocked' },
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
