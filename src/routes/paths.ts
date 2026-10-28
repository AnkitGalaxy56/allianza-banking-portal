export const PATHS = {
  login: '/login',
  otp: '/verify-otp',
  dashboard: '/dashboard',

  // Allianza admin
  banks: '/banks',
  users: '/users',
  uploadImages: '/upload-images',
  customerOnboarding: '/customer-Onboarding',

  // Bank admin / bank user
  branches: '/branches',
  // users-management
  userManagement: '/user-management',
  customers: '/customers',
  serviceRequests: '/service-requests',
  leadEnquiries: '/lead-enquiries',
  banners: '/banners',

  // Shared
  reports: '/reports',
  pushNotifications: '/push-notifications',
  deviceReset: '/device-reset',
  requestValidation: '/request-validation',
} as const;
