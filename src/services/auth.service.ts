import { env } from '@/config/env';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    // `import.meta.env.DEV &&` lets the bundler remove the mock code from production builds.
    if (import.meta.env.DEV && env.useMockApi) {
      const { mockLogin } = await import('./mock/mockAuth');
      return mockLogin(payload);
    }
    const { data } = await api.post<LoginResponse>(ENDPOINTS.auth.login, payload);
    return data;
  },

  async logout(): Promise<void> {
    if (import.meta.env.DEV && env.useMockApi) return;
    await api.post(ENDPOINTS.auth.logout);
  },
};
