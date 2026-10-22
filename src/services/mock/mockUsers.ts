import { ROLES, type Role } from '@/config/roles';
import type { User } from '@/types/auth';

/**
 * TEMPORARY DEVELOPMENT LOGINS - used only when VITE_USE_MOCK_API=true in `npm run dev`.
 * Never shipped in production builds (this file is only loaded through dynamic imports
 * guarded by `import.meta.env.DEV`).
 */
interface MockAccount {
  loginId: string;
  password: string;
  user: User;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    loginId: 'allianza.admin',
    password: 'Admin@123',
    user: { id: 'u-1', name: 'Allianza Admin', email: 'admin@allianza.example', role: ROLES.SUPER_ADMIN },
  },
  {
    loginId: 'bank.admin',
    password: 'Admin@123',
    user: {
      id: 'u-2',
      name: 'Bank Admin',
      email: 'admin@bank.example',
      role: ROLES.BANK_ADMIN,
      bankCode: 'sample-urban',
      bankName: 'Sample Urban Co-op Bank',
    },
  },
  {
    loginId: 'bank.user',
    password: 'User@123',
    user: {
      id: 'u-3',
      name: 'Bank Employee',
      email: 'employee@bank.example',
      role: ROLES.BANK_USER,
      bankCode: 'sample-urban',
      bankName: 'Sample Urban Co-op Bank',
    },
  },
  {
    loginId: 'sahakari.admin',
    password: 'Admin@123',
    user: {
      id: 'u-4',
      name: 'Sahakari Admin',
      email: 'admin@sahakari.example',
      role: ROLES.BANK_ADMIN,
      bankCode: 'demo-sahakari',
      bankName: 'Demo Sahakari Bank',
    },
  },
  {
    loginId: 'nagar.admin',
    password: 'Admin@123',
    user: {
      id: 'u-5',
      name: 'Nagar Admin',
      email: 'admin@nagar.example',
      role: ROLES.BANK_ADMIN,
      bankCode: 'nagar-co-op',
      bankName: 'Nagar Co-op Bank',
    },
  },
 
  {
  loginId: 'puneurban.admin',
  password: 'Admin@123',
  user: {
    id: 'u-6',
    name: 'Pune Urban Admin',
    email: 'admin@puneurban.example',
    role: ROLES.BANK_ADMIN,
    bankCode: 'pune-urban',
    bankName: 'Pune Urban Co-operative Bank',
  },
},
];

export interface DevCredential {
  loginId: string;
  password: string;
  label: string;
}

/** Logins shown in the "Development logins" box on the login page. */
export function getDevCredentials(role: Role, bankCode: string | null): DevCredential[] {
  const forRole = MOCK_ACCOUNTS.filter((a) => a.user.role === role);
  const forBank =
    role === ROLES.SUPER_ADMIN ? forRole : forRole.filter((a) => a.user.bankCode === bankCode);
  return (forBank.length ? forBank : forRole).map((a) => ({
    loginId: a.loginId,
    password: a.password,
    label: a.user.bankName ?? 'Allianza',
  }));
}
