import { env } from '@/config/env';
import { api } from '@/services/api/axiosInstance';
import { ENDPOINTS } from '@/services/api/endpoints';
import type { User } from '@/types/auth';
import type { EditableProfileFields, UserProfile } from '@/pages/profile/types/profile';

const STORAGE_PREFIX = 'allianza.profile.';
const profileKey = (id: string) => `${STORAGE_PREFIX}${id}`;

function defaultProfile(user: User): UserProfile {
  const parts = user.name.trim().split(/\s+/).filter(Boolean);
  const bankName = user.bankName ?? 'Allianza';
  return {
    id: user.id,
    fullName: user.name || 'Not added',
    firstName: parts[0] ?? '',
    middleName: '',
    lastName: parts.slice(1).join(' '),
    employeeId: '',
    userName: user.email?.split('@')[0] ?? '',
    email: user.email ?? '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    accountState: 'OPERATIVE',
    designation: '',
    userRole: user.role,
    loginBranch: user.role === 'SUPER_ADMIN' ? 'Allianza' : 'Main branch',
    branchId: user.role === 'SUPER_ADMIN' ? '' : '1',
    allowMultiBranch: false,
    allowLoginOnHolidays: false,
    permittedLoginTime: '',
    permittedLogoutTime: '',
    lastLoginDate: new Date().toISOString().slice(0, 10),
    lastLoginTime: '',
    sessionTimeoutSeconds: 1800,
    organizationName: bankName,
    organizationCode: user.bankCode ?? 'ALLIANZA',
  };
}

export const profileService = {
  async getCurrent(user: User): Promise<UserProfile> {
    if (env.useMockApi) {
      const saved = window.localStorage.getItem(profileKey(user.id));
      return { ...defaultProfile(user), ...(saved ? JSON.parse(saved) as Partial<UserProfile> : {}) };
    }
    const { data } = await api.get<UserProfile>(ENDPOINTS.auth.profile);
    return data;
  },

  async updateCurrent(user: User, changes: EditableProfileFields): Promise<UserProfile> {
    if (env.useMockApi) {
      const current = await this.getCurrent(user);
      const updated = { ...current, email: changes.email.trim(), mobile: changes.mobile.trim() };
      window.localStorage.setItem(profileKey(user.id), JSON.stringify(updated));
      return updated;
    }
    const { data } = await api.put<UserProfile>(ENDPOINTS.auth.profile, {
      email: changes.email.trim(),
      mobile: changes.mobile.trim(),
    });
    return data;
  },
};
