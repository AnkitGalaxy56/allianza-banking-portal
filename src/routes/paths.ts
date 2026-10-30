


export const PATHS = {
  // Authentication
  AUTH: {
    LOGIN: '/login',
    OTP: '/verify-otp',
    DASHBOARD: '/dashboard',
  },

  // Existing application routes
  BANKS: { ROOT: '/banks' },
  USERS: { ROOT: '/users' },
  UPLOAD_IMAGES: { ROOT: '/upload-images' },
  CUSTOMER_ONBOARDING: { ROOT: '/customer-Onboarding' },
  BRANCHES: { ROOT: '/branches' },
  BRANCH_USERS: { ROOT: '/branch-users' },
  CUSTOMERS: { ROOT: '/customers' },
  SERVICE_REQUESTS: { ROOT: '/service-requests' },
  LEAD_ENQUIRIES: { ROOT: '/lead-enquiries' },
  BANNERS: { ROOT: '/banners' },

  // Profile
  PROFILE: {
    ROOT: '/profile',
    PHOTO: '/profile/photo',
    NAME: '/profile/name',
    EMAIL: '/profile/email',
    MOBILE: '/profile/mobile',
  },

  // Request Handling
  REQUEST_HANDLING: {
    ROOT: '/request-handling',
    PAYMENTS: '/request-handling/payments',
    CHEQUE_BOOK: '/request-handling/cheque-book',
    STOP_PAYMENT: '/request-handling/stop-payment',
    FD_OPENING: '/request-handling/fd-opening',
    RD_OPENING: '/request-handling/rd-opening',
    FD_RD_CLOSING: '/request-handling/fd-rd-closing',
    LOCKER_APPLICATION: '/request-handling/locker-application',
    STANDING_INSTRUCTIONS: '/request-handling/standing-instructions',
    FRESH_LOAN_APPLICATION: '/request-handling/fresh-loan-application',
    LOAN_EMI_PAYMENT: '/request-handling/loan-emi-payment',
    CUSTOMER_ONBOARDING: '/request-handling/customer-Onboarding',
    LEAD_MANAGEMENT: '/request-handling/lead-management',
  },

  // Legacy Request Validation routes retained for old links/bookmarks
  REQUEST_VALIDATION: {
    ROOT: '/request-validation',
    PAYMENTS: '/request-validation/payments',
    OPENING_ACCOUNTS: '/request-validation/opening-accounts',
    CLOSING_ACCOUNTS: '/request-validation/closing-accounts',
    LEAD_MANAGEMENT: '/request-validation/lead-management',
    STOP_PAYMENT: '/request-validation/stop-payment',
    STANDING_INSTRUCTIONS: '/request-validation/standing-instructions',
  },

  MASTERS: {
    ROOT: '/masters',
    BANK_MASTER: '/masters/bank-master',
    BRANCH_MASTER: '/masters/branch-master',
  },
  MOBILE_UTILITIES: {
    ROOT: '/mobile-utilities',
    IMAGE_UPLOADING: '/mobile-utilities/image-uploading',
    PUSH_NOTIFICATION: '/mobile-utilities/push-notification',
    DEVICE_RESET: '/mobile-utilities/device-reset',
  },
  USER_MANAGEMENT: {
    ROOT: '/user-management',
    USER_MASTER: '/user-management/user-master',
    ASSIGN_PASSWORD: '/user-management/assign-password',
  },
  REPORTS: {
    ROOT: '/reports',
    REQUESTS: '/reports/requests',
    USER_MASTER: '/reports/user-master',
    NOTIFICATION: '/reports/notification',
  },
  SETTINGS: {
    ROOT: '/settings',
    CHANGE_PASSWORD: '/settings/change-password',
    PROFILE: '/settings/profile',
    ROLES_ACCESS_CONTROL: '/settings/roles-access-control',
    CHANGE_COLOUR_THEME: '/settings/change-colour-theme',
  },
  PUSH_NOTIFICATIONS: { ROOT: '/push-notifications' },
  DEVICE_RESET: { ROOT: '/device-reset' },
} as const;
