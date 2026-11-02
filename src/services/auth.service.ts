import { env } from '@/config/env';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    // Mock mode can also be enabled for a Vercel demo through VITE_USE_MOCK_API=true.
    if (env.useMockApi) {
      const { mockLogin } = await import('./mock/mockAuth');
      return mockLogin(payload);
    }
    const { data } = await api.post<LoginResponse>(ENDPOINTS.auth.login, payload);
    return data;
  },

  async logout(): Promise<void> {
    if (env.useMockApi) return;
    await api.post(ENDPOINTS.auth.logout);
  },
};
