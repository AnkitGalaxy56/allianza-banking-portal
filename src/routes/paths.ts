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
  userManagement: '/user-management',
  customers: '/customers',
  serviceRequests: '/service-requests',
  leadEnquiries: '/lead-enquiries',
  banners: '/banners',

  // Request validation and its submenu pages
  requestValidation: '/request-validation',
  requestValidationPayments: '/request-validation/payments',
  requestValidationOpeningAccounts: '/request-validation/opening-accounts',
  requestValidationClosingAccounts: '/request-validation/closing-accounts',
  requestValidationLeadManagement: '/request-validation/lead-management',
  requestValidationStopPayment: '/request-validation/stop-payment',

  // Shared
  reports: '/reports',
  pushNotifications: '/push-notifications',
  deviceReset: '/device-reset',
  requestValidation: '/request-validation',
} as const;
