import { env } from '@/config/env';
import type { BankDashboardData, SuperAdminDashboardData } from '@/types/dashboard';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const dashboardService = {
  async getSuperAdminDashboard(): Promise<SuperAdminDashboardData> {
    if (env.useMockApi) {
      const { mockSuperAdminDashboard } = await import('./mock/mockDashboard');
      return mockSuperAdminDashboard();
    }
    const { data } = await api.get<SuperAdminDashboardData>(ENDPOINTS.dashboard.superAdmin);
    return data;
  },

  /** `branch` = branch name/id to filter by; empty = all branches. */
  async getBankDashboard(branch?: string): Promise<BankDashboardData> {
    if (env.useMockApi) {
      const { mockBankDashboard } = await import('./mock/mockDashboard');
      return mockBankDashboard(branch);
    }
    const { data } = await api.get<BankDashboardData>(ENDPOINTS.dashboard.bank, {
      params: branch ? { branch } : undefined,
    });
    return data;
  },
};
