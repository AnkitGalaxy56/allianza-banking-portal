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
    adminList: '/themes',
    create: '/themes',
    byCode: (code: string) => `/themes/${encodeURIComponent(code)}`,
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
    assignPassword: (id: string) => `/user-management/${encodeURIComponent(id)}/assign-password`,
  },
  /** Real API routes reserved for the User Management Redux/service layer. */
  userManagement: {
    users: '/user-management',
    userById: (id: string) => `/user-management/${encodeURIComponent(id)}`,
    authorizeUser: (id: string) => `/user-management/${encodeURIComponent(id)}/authorize`,
    status: (id: string) => `/user-management/${encodeURIComponent(id)}/status`,
    assignPassword: (id: string) => `/user-management/${encodeURIComponent(id)}/assign-password`,
  },
  // Settings
  settings: {
    profile: '/auth/profile',
    changePasswordRequestOtp: '/auth/change-password/request-otp',
    changePasswordVerifyOtp: '/auth/change-password/verify-otp',
    roles: '/settings/roles',
    roleById: (id: string) => `/settings/roles/${encodeURIComponent(id)}`,
    themes: '/settings/themes',
    themeByCode: (code: string) => `/settings/themes/${encodeURIComponent(code)}`,
  },
banners: {
    base: '/banners',
    byId: (id: string) => `/banners/${encodeURIComponent(id)}`,
    upload: '/banners/upload',
  },
  customers: {
    base: '/customers',
    byId: (id: string) => `/customers/${encodeURIComponent(id)}`,
    resetDevice: (id: string) => `/customers/${encodeURIComponent(id)}/reset-device`,
  },
  banks: {
    base: '/banks',
    byId: (id: string) => `/banks/${encodeURIComponent(id)}`,
  },
  mobileUtilities: {
    images: {
      base: '/mobile-utilities/images',
      byId: (id: string) => `/mobile-utilities/images/${encodeURIComponent(id)}`,
    },
    notifications: {
      base: '/mobile-utilities/notifications',
      byId: (id: string) => `/mobile-utilities/notifications/${encodeURIComponent(id)}`,
      send: (id: string) => `/mobile-utilities/notifications/${encodeURIComponent(id)}/send`,
    },
    deviceReset: {
      base: '/mobile-utilities/device-resets',
      byId: (id: string) => `/mobile-utilities/device-resets/${encodeURIComponent(id)}`,
      lookup: '/mobile-utilities/device-resets/lookup',
      reset: '/mobile-utilities/device-resets',
    },
  },
  /** Request-handling APIs. Override these paths here to match the backend contract. */
  requestHandling: {
    base: (module: string) => `/request-handling/${module}`,
    byId: (module: string, id: string) => `/request-handling/${module}/${encodeURIComponent(id)}`,
    decision: (module: string, id: string) => `/request-handling/${module}/${encodeURIComponent(id)}/decision`,
    remove: (module: string, id: string) => `/request-handling/${module}/${encodeURIComponent(id)}`,
  },
} as const;
