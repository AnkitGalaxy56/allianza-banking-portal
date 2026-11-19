import { env } from '@/config/env';
import type { LoginRequest, LoginResponse, PendingLoginResponse } from '@/types/auth';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const authService = {
  async login(payload: LoginRequest): Promise<PendingLoginResponse> {
    // Mock mode can also be enabled for a Vercel demo through VITE_USE_MOCK_API=true.
    if (env.useMockApi) {
      const { mockLogin } = await import('./mock/mockAuth');
      return mockLogin(payload) as unknown as PendingLoginResponse;
    }
    const { data } = await api.post<PendingLoginResponse>(ENDPOINTS.auth.login, payload);
    return data;
  },

  async verifyOtp(payload: { challengeId: string; otp: string }): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(ENDPOINTS.auth.verifyOtp, payload);
    return data;
  },

  async checkSession(): Promise<void> {
    if (env.useMockApi) return;
    await api.get(ENDPOINTS.auth.profile);
  },

  async verifySession(payload: { loginId: string; password: string }): Promise<void> {
    const { data } = await api.post(ENDPOINTS.auth.verifySession, payload);
    if (data?.verified !== 'true') throw new Error(data?.message ?? 'Verification failed.');
  },

  async logout(): Promise<void> {
    if (env.useMockApi) return;
    await api.post(ENDPOINTS.auth.logout);
  },
};
