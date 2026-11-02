import { env } from '@/config/env';
import type { BankTheme } from '@/types/theme';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

export const themeService = {
  async getBankTheme(bankCode: string): Promise<BankTheme> {
    if (env.useMockApi) {
      const { mockGetBankTheme } = await import('./mock/mockThemes');
      return mockGetBankTheme(bankCode);
    }
    const { data } = await api.get<BankTheme>(ENDPOINTS.themes.byBankCode(bankCode));
    return data;
  },
};
