import type { PortalType } from '@/types/auth';
import type { User } from '@/types/auth';

interface MockAccount {
  loginId: string;
  password: string;
  user: User;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    loginId: 'allianza.admin',
    password: 'Admin@123',
    user: { id: 'u-1', name: 'Allianza Admin', email: 'admin@allianza.example', userRole: 'SUPER_ADMIN' },
  },
  {
    loginId: 'bank.admin',
    password: 'Admin@123',
    user: {
      id: 'u-2', name: 'Bank Admin', email: 'admin@bank.example', userRole: 'BANK_ADMIN',
      bankCode: 'sample-urban', bankName: 'Sample Urban Co-op Bank',
    },
  },
  {
    loginId: 'bank.user',
    password: 'User@123',
    user: {
      id: 'u-3', name: 'Bank Employee', email: 'employee@bank.example', userRole: 'BANK_USER',
      bankCode: 'sample-urban', bankName: 'Sample Urban Co-op Bank',
    },
  },
  {
    loginId: 'sahakari.admin',
    password: 'Admin@123',
    user: {
      id: 'u-4', name: 'Sahakari Admin', email: 'admin@sahakari.example', userRole: 'BANK_ADMIN',
      bankCode: 'demo-sahakari', bankName: 'Demo Sahakari Bank',
    },
  },
  {
    loginId: 'nagar.admin',
    password: 'Admin@123',
    user: {
      id: 'u-5', name: 'Nagar Admin', email: 'admin@nagar.example', userRole: 'BANK_ADMIN',
      bankCode: 'nagar-co-op', bankName: 'Nagar Co-op Bank',
    },
  },
  {
    loginId: 'puneurban.admin',
    password: 'Admin@123',
    user: {
      id: 'u-6', name: 'Pune Urban Admin', email: 'admin@puneurban.example', userRole: 'BANK_ADMIN',
      bankCode: 'pune-urban', bankName: 'Pune Urban Co-operative Bank',
    },
  },
];

export interface DevCredential {
  loginId: string;
  password: string;
  label: string;
}

export function getDevCredentials(portalType: PortalType, bankCode: string | null): DevCredential[] {
  const matching = MOCK_ACCOUNTS.filter((a) => {
    const isBank = Boolean(a.user.bankCode);
    if (portalType === 'ALLIANZA') return !isBank;
    return isBank && a.user.bankCode === bankCode;
  });

  return matching.map((a) => ({
    loginId: a.loginId,
    password: a.password,
    label: a.user.bankName ?? 'Allianza',
  }));
}
