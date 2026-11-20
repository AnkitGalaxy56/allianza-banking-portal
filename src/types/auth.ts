export type PortalType = 'ALLIANZA' | 'BANK';

export interface User {
  id: string;
  name: string;
  email: string;
  loginId?: string;
  /** Backend/profile supplied role. Never used to determine the portal. */
  userRole?: string;
  /** Kept for compatibility with existing screens; populated from profile.userRole. */
  role?: string;
  bankCode?: string;
  bankName?: string;
  systemRole?: 'Admin' | 'Maker' | 'Checker' | string;
  loginBranch?: string;
  designation?: string;
  branch?: string;
  idleTimeoutMinutes?: number;
}

export interface LoginRequest {
  loginId: string;
  password: string;
  /** Portal selected by the login URL. */
  portalType: PortalType;
  /** Present only when signing in through /login?bank=<code>. */
  bankCode?: string;
}

export interface PendingLoginResponse {
  otpRequired: boolean;
  challengeId: string;
  message?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  /** Portal is decided by the URL used for login, not by the user's role. */
  portalType: PortalType;
  remember: boolean;
}
