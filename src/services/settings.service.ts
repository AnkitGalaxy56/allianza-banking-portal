import { api } from '@/services/api/axiosInstance';
import { ENDPOINTS } from '@/services/api/endpoints';
import type { AccessRole } from '@/pages/settings/roles-access-control/types/role';
import type { BankTheme } from '@/types/theme';
import type { EditableProfileFields, UserProfile } from '@/pages/profile/types/profile';
import type { User } from '@/types/auth';

/** Real backend API layer for Settings. */
export const settingsService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>(ENDPOINTS.settings.profile);
    return data;
  },

  async updateProfile(body: EditableProfileFields): Promise<UserProfile> {
    const { data } = await api.put<UserProfile>(ENDPOINTS.settings.profile, {
      email: body.email.trim(),
      mobile: body.mobile.trim(),
    });
    return data;
  },

  async requestPasswordOtp(body: { oldPassword: string; newPassword: string }): Promise<void> {
    await api.post(ENDPOINTS.settings.changePasswordRequestOtp, body);
  },

  async verifyPasswordOtp(body: { otp: string }): Promise<void> {
    await api.post(ENDPOINTS.settings.changePasswordVerifyOtp, body);
  },

  async listRoles(): Promise<AccessRole[]> {
    const { data } = await api.get<AccessRole[]>(ENDPOINTS.settings.roles);
    return data;
  },

  async createRole(body: AccessRole): Promise<AccessRole> {
    const { data } = await api.post<AccessRole>(ENDPOINTS.settings.roles, body);
    return data;
  },

  async updateRole(id: string, body: AccessRole): Promise<AccessRole> {
    const { data } = await api.put<AccessRole>(ENDPOINTS.settings.roleById(id), body);
    return data;
  },

  async deleteRole(id: string): Promise<void> {
    await api.delete(ENDPOINTS.settings.roleById(id));
  },

  async listThemes(): Promise<BankTheme[]> {
    const { data } = await api.get<BankTheme[]>(ENDPOINTS.settings.themes);
    return data;
  },

  async createTheme(body: BankTheme): Promise<BankTheme> {
    const { data } = await api.post<BankTheme>(ENDPOINTS.settings.themes, body);
    return data;
  },

  async updateTheme(code: string, body: BankTheme): Promise<BankTheme> {
    const { data } = await api.put<BankTheme>(ENDPOINTS.settings.themeByCode(code), body);
    return data;
  },

  async deleteTheme(code: string): Promise<void> {
    await api.delete(ENDPOINTS.settings.themeByCode(code));
  },
};

// Keep this import-compatible helper available for callers that already have the logged-in user.
export type SettingsCurrentUser = User;
