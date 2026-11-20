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
      (req.portalType === 'ALLIANZA' ? !a.user.bankCode : Boolean(a.user.bankCode)) &&
      (!req.bankCode || a.user.bankCode === req.bankCode),
  );

  if (!account) {
    throw new Error('Invalid login ID or password for this portal.');
  }

  const { user } = account;
  return {
    user,
    accessToken: createMockJwt(
      { sub: user.id, name: user.name, email: user.email, userRole: user.userRole, bankCode: user.bankCode },
      60 * 60,
    ),
    refreshToken: createMockJwt({ sub: user.id, type: 'refresh' }, 7 * 24 * 60 * 60),
  };
}
