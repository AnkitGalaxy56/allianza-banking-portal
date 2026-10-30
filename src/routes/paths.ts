


export const PATHS = {
  //--------------------------------------------------------------
  DASHBOARD: "/dashboard",

  PROFILE: {
    ROOT: "/profile",
    PHOTO: "/profile/photo",
    NAME: "/profile/name",
    EMAIL: "/profile/email",
    MOBILE: "/profile/mobile",
  },

  REQUEST_HANDLING: {
    ROOT: "/request-handling",
    PAYMENTS: "/request-handling/payments",
    CHEQUE_BOOK: "/request-handling/cheque-book",
    STOP_PAYMENT: "/request-handling/stop-payment",
    FD_OPENING: "/request-handling/fd-opening",
    RD_OPENING: "/request-handling/rd-opening",
    FD_RD_CLOSING: "/request-handling/fd-rd-closing",
    LOCKER_APPLICATION: "/request-handling/locker-application",
    STANDING_INSTRUCTIONS: "/request-handling/standing-instructions",
    FRESH_LOAN_APPLICATION: "/request-handling/fresh-loan-application",
    LOAN_EMI_PAYMENT: "/request-handling/loan-emi-payment",
  },

  MASTERS: {
    ROOT: "/masters",
    BANK_MASTER: "/masters/bank-master",
    BRANCH_MASTER: "/masters/branch-master",
  },

  MOBILE_UTILITIES: {
    ROOT: "/mobile-utilities",
    IMAGE_UPLOADING: "/mobile-utilities/image-uploading",
    PUSH_NOTIFICATION: "/mobile-utilities/push-notification",
    DEVICE_RESET: "/mobile-utilities/device-reset",
  },

  USER_MANAGEMENT: {
    ROOT: "/user-management",
    USER_MASTER: "/user-management/user-master",
    ASSIGN_PASSWORD: "/user-management/assign-password",
  },

  REPORTS: {
    ROOT: "/reports",
    REQUESTS: "/reports/requests",
    USER_MASTER: "/reports/user-master",
    NOTIFICATION: "/reports/notification",
  },

  SETTINGS: {
    ROOT: "/settings",
    CHANGE_PASSWORD: "/settings/change-password",
    PROFILE: "/settings/profile",
    ROLES_ACCESS_CONTROL: "/settings/roles-access-control",
    CHANGE_COLOUR_THEME: "/settings/change-colour-theme",
  },
  //-------------------------------------------------------------


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
  requestValidationStandingInstructions: '/request-validation/standing-instructions',

  // Shared
  reports: '/reports',
  pushNotifications: '/push-notifications',
  deviceReset: '/device-reset',
} as const;
