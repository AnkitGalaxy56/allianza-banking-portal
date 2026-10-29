/** Every backend URL lives here. Change paths in one place when the real API is ready. */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    changePasswordRequestOtp: '/auth/change-password/request-otp',
    changePasswordVerifyOtp: '/auth/change-password/verify-otp',
  },
  themes: {
    /** Must be PUBLIC (no token) - the login page needs it before anyone is signed in. */
    byBankCode: (code: string) => `/banks/${encodeURIComponent(code)}/theme`,
  },
  dashboard: {
    superAdmin: '/dashboard/super-admin',
    bank: '/dashboard/bank',
  },
  branches: {
    base: '/branches',
    byId: (id: string) => `/branches/${encodeURIComponent(id)}`,
  },
  branchUsers: {
    base: '/user-management',
    byId: (id: string) => `/user-management/${encodeURIComponent(id)}`,
  },
  customers: {
    base: '/customers',
    byId: (id: string) => `/customers/${encodeURIComponent(id)}`,
    resetDevice: (id: string) => `/customers/${encodeURIComponent(id)}/reset-device`,
  },
} as const;
