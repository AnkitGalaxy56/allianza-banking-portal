export const PATHS = {
  login: '/login',
  otp: '/verify-otp',
  dashboard: '/dashboard',

  // Allianza admin
  banks: '/banks',
  users: '/users',
  uploadImages: '/upload-images',

  // Bank admin / bank user
  branches: '/branches',
  branchUsers: '/branch-users',
  customers: '/customers',
  serviceRequests: '/service-requests',
  leadEnquiries: '/lead-enquiries',
  banners: '/banners',

  // Shared
  reports: '/reports',
  pushNotifications: '/push-notifications',
  deviceReset: '/device-reset',
} as const;
