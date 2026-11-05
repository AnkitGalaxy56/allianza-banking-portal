import { env } from '@/config/env';
import type { BankTheme } from '@/types/theme';
import { ALLIANZA_THEME } from '@/theme/platformTheme';
import { api } from './api/axiosInstance';
import { ENDPOINTS } from './api/endpoints';

const withPlatformTheme = (themes: BankTheme[]) => {
  const platform = themes.find((theme) => theme.code === ALLIANZA_THEME.code) ?? ALLIANZA_THEME;
  return [platform, ...themes.filter((theme) => theme.code !== ALLIANZA_THEME.code)];
};

export const themeManagementService = {
  async getByCode(code: string): Promise<BankTheme> {
    if (env.useMockApi) {
      const { getMockBankThemes } = await import('./mock/mockThemes');
      const found = getMockBankThemes().find((theme) => theme.code === code);
      if (!found) throw new Error(`Theme \"${code}\" was not found.`);
      return found;
    }
    const { data } = await api.get<BankTheme>(ENDPOINTS.themes.byCode(code));
    return data;
  },
  async list(): Promise<BankTheme[]> {
    if (env.useMockApi) {
      const { getMockBankThemes } = await import('./mock/mockThemes');
      return withPlatformTheme(getMockBankThemes());
    }
    const { data } = await api.get<BankTheme[]>(ENDPOINTS.themes.adminList);
    return withPlatformTheme(data);
  },
  async save(theme: BankTheme, isNew: boolean): Promise<BankTheme> {
    if (env.useMockApi) {
      const { getMockBankThemes, saveMockBankThemes } = await import('./mock/mockThemes');
      const themes = getMockBankThemes();
      const next = themes.some((item) => item.code === theme.code)
        ? themes.map((item) => item.code === theme.code ? theme : item)
        : [...themes, theme];
      saveMockBankThemes(next);
      return theme;
    }
    const { data } = isNew
      ? await api.post<BankTheme>(ENDPOINTS.themes.create, theme)
      : await api.put<BankTheme>(ENDPOINTS.themes.byCode(theme.code), theme);
    return data;
  },
  async remove(code: string): Promise<void> {
    if (code === ALLIANZA_THEME.code) throw new Error('The Allianza platform theme cannot be deleted.');
    if (env.useMockApi) {
      const { getMockBankThemes, saveMockBankThemes } = await import('./mock/mockThemes');
      saveMockBankThemes(getMockBankThemes().filter((theme) => theme.code !== code));
      return;
    }
    await api.delete(ENDPOINTS.themes.byCode(code));
  },
};
