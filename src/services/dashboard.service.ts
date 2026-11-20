import { env } from '@/config/env';
import type { BankDashboardData, SuperAdminDashboardData } from '@/types/dashboard';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

/**
 * The dashboard API can be returned either directly or wrapped in a `data`
 * property depending on the backend controller/response wrapper. Keep that
 * backend detail out of the dashboard component so the UI never crashes just
 * because the response is wrapped.
 */
function unwrap<T>(value: unknown): T {
  if (value && typeof value === 'object' && 'data' in value) {
    const candidate = (value as { data?: unknown }).data;
    if (candidate && typeof candidate === 'object') return candidate as T;
  }
  return value as T;
}

function normalizeSuperAdminDashboard(value: unknown): SuperAdminDashboardData {
  const raw = unwrap<Record<string, unknown>>(value) ?? {};

  const rawStats = Array.isArray(raw.stats) ? raw.stats : [];
  const stats = rawStats.map((item) => {
    const s = (item ?? {}) as Record<string, unknown>;
    return {
      key: String(s.key ?? ''),
      label: String(s.label ?? ''),
      value: String(s.value ?? 0),
      helper: s.helper == null ? undefined : String(s.helper),
      helperTone: (s.helperTone === 'success' || s.helperTone === 'warning' || s.helperTone === 'neutral')
        ? s.helperTone
        : undefined,
      icon: (() => {
        const iconNames = ['branches', 'customers', 'requests', 'notifications', 'banks', 'users', 'accounts', 'loans'] as const;
        return typeof s.icon === 'string' && iconNames.includes(s.icon as typeof iconNames[number])
          ? s.icon as SuperAdminDashboardData['stats'][number]['icon']
          : 'requests';
      })(),
    };
  });

  const rawBanks = Array.isArray(raw.recentBanks)
    ? raw.recentBanks
    : Array.isArray(raw.banks)
      ? raw.banks
      : [];

  const recentBanks = rawBanks.map((item, index) => {
    const bank = (item ?? {}) as Record<string, unknown>;
    return {
      id: String(bank.id ?? bank.bankId ?? bank.code ?? `bank-${index}`),
      name: String(bank.name ?? bank.bankName ?? bank.organizationName ?? ''),
      code: String(bank.code ?? bank.bankCode ?? bank.organizationCode ?? ''),
      type: String(bank.type ?? bank.bankType ?? 'Bank'),
      branches: Number(bank.branches ?? bank.branchCount ?? 0),
      users: Number(bank.users ?? bank.userCount ?? bank.appUsers ?? 0),
      status: String(bank.status ?? 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active',
    };
  }).filter((bank) => bank.name || bank.code);

  const rawRequests = Array.isArray(raw.requestsByBank)
    ? raw.requestsByBank
    : Array.isArray(raw.requestByBank)
      ? raw.requestByBank
      : [];

  const requestsByBank = rawRequests.map((item) => {
    const request = (item ?? {}) as Record<string, unknown>;
    return {
      label: String(request.label ?? request.name ?? request.bankName ?? ''),
      count: Number(request.count ?? request.total ?? request.requests ?? 0),
    };
  }).filter((item) => item.label);

  return { stats, recentBanks, requestsByBank };
}

export const dashboardService = {
  async getSuperAdminDashboard(bankCode?: string): Promise<SuperAdminDashboardData> {
    if (env.useMockApi) {
      const { mockSuperAdminDashboard } = await import('./mock/mockDashboard');
      return mockSuperAdminDashboard();
    }

    const { data } = await api.get(ENDPOINTS.dashboard.superAdmin, {
      params: bankCode ? { bankCode } : undefined,
    });
    return normalizeSuperAdminDashboard(data);
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
