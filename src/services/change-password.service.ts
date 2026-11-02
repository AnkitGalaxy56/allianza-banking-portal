import { env } from '@/config/env';
import { api } from '@/services/api/axiosInstance';
import { ENDPOINTS } from '@/services/api/endpoints';
import type { User } from '@/types/auth';

let mockPending: { userId: string; newPassword: string } | null = null;

export const changePasswordService = {
  async requestOtp(user: User, oldPassword: string, newPassword: string): Promise<{ demoOtp?: string }> {
    if (env.useMockApi) {
      const { MOCK_ACCOUNTS } = await import('@/services/mock/mockUsers');
      const account = MOCK_ACCOUNTS.find((item) => item.user.id === user.id);
      if (!account || account.password !== oldPassword) throw new Error('Current password is incorrect.');
      mockPending = { userId: user.id, newPassword };
      return { demoOtp: '123456' };
    }
    await api.post(ENDPOINTS.auth.changePasswordRequestOtp, { oldPassword, newPassword });
    return {};
  },

  async verifyOtp(user: User, otp: string): Promise<void> {
    if (env.useMockApi) {
      if (!mockPending || mockPending.userId !== user.id) throw new Error('Password change session expired. Start again.');
      if (otp !== '123456') throw new Error('Invalid OTP. For local demo, use 123456.');
      const { MOCK_ACCOUNTS } = await import('@/services/mock/mockUsers');
      const account = MOCK_ACCOUNTS.find((item) => item.user.id === user.id);
      if (!account) throw new Error('Demo account could not be found.');
      account.password = mockPending.newPassword;
      mockPending = null;
      return;
    }
    await api.post(ENDPOINTS.auth.changePasswordVerifyOtp, { otp });
  },
};
