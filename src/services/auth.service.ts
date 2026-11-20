import type { LoginRequest, LoginResponse, PendingLoginResponse } from '@/types/auth';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const authService = {
  async login(payload: LoginRequest): Promise<PendingLoginResponse> {
    // Authentication always uses the real backend in this integration build.
    const { data } = await api.post<PendingLoginResponse>(ENDPOINTS.auth.login, payload);
    return data;
  },

  async verifyOtp(payload: { challengeId: string; otp: string }): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(ENDPOINTS.auth.verifyOtp, payload);
    return data;
  },

  async checkSession(): Promise<void> {
    await api.get(ENDPOINTS.auth.profile);
  },

  async verifySession(payload: { loginId: string; password: string }): Promise<void> {
    const { data } = await api.post(ENDPOINTS.auth.verifySession, payload);
    if (data?.verified !== 'true') throw new Error(data?.message ?? 'Verification failed.');
  },

  async logout(): Promise<void> {
    await api.post(ENDPOINTS.auth.logout);
  },
};
