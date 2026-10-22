import { ROLES } from '@/config/roles';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { delay } from '@/utils/delay';
import { createMockJwt } from './mockJwt';
import { MOCK_ACCOUNTS } from './mockUsers';

export async function mockLogin(req: LoginRequest): Promise<LoginResponse> {
  await delay(500);

  const account = MOCK_ACCOUNTS.find(
    (a) =>
      a.loginId.toLowerCase() === req.loginId.trim().toLowerCase() &&
      a.password === req.password &&
      a.user.role === req.role,
  );
  if (!account) {
    throw new Error('Invalid login ID or password for the selected login type.');
  }
  if (req.role !== ROLES.SUPER_ADMIN && req.bankCode && account.user.bankCode !== req.bankCode) {
    throw new Error('This account does not belong to the selected bank.');
  }

  const { user } = account;
  return {
    user,
    accessToken: createMockJwt(
      { sub: user.id, name: user.name, email: user.email, role: user.role, bankCode: user.bankCode },
      60 * 60,
    ),
    refreshToken: createMockJwt({ sub: user.id, type: 'refresh' }, 7 * 24 * 60 * 60),
  };
}
