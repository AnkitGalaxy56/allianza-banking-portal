import { env } from '@/config/env';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';
import { delay } from '@/utils/delay';

/**
 * Passwords are sent directly to the API and are never persisted by the frontend.
 * The mock branch only simulates a successful response for local UI development.
 */
export const assignPasswordService = {
  async assign(userId: string, password: string): Promise<void> {
    if (env.useMockApi) {
      await delay(350);
      if (!userId || !password) throw new Error('User and password are required.');
      return;
    }

    await api.post(ENDPOINTS.branchUsers.assignPassword(userId), { password });
  },
};
