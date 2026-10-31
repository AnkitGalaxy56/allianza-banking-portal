/** Shared account status codes used across request and account-management screens. */
export const ACCOUNT_STATUS_CODES = [
  { code: '001', label: 'Entered' },
  { code: '002', label: 'Operative' },
  { code: '003', label: 'In-Operative' },
  { code: '004', label: 'Suspended' },
  { code: '005', label: 'Password Blocked' },
] as const;

export const ACCOUNT_STATUS_OPTIONS = ACCOUNT_STATUS_CODES.map(({ code, label }) => ({
  value: code,
  label: `${code} - ${label}`,
}));
