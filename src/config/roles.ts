export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN', // Allianza (platform owner)
  BANK_ADMIN: 'BANK_ADMIN', // Admin of one bank
  BANK_USER: 'BANK_USER', // Bank employee
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Allianza Admin',
  BANK_ADMIN: 'Bank Admin',
  BANK_USER: 'Bank User',
};

/** Order used by the role switch on the login page. */
export const LOGIN_ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: ROLES.SUPER_ADMIN, label: 'Admin' },
  { value: ROLES.BANK_ADMIN, label: 'User' },
  // { value: ROLES.BANK_USER, label: 'Bank User' },
];

export const isBankRole = (role: Role): boolean => role !== ROLES.SUPER_ADMIN;
