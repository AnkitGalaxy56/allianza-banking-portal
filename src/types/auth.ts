import type { Role } from '@/config/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  /** Backend login name used for idle-session credential verification. */
  loginId?: string;
  role: Role;
  /** Not set for SUPER_ADMIN */
  bankCode?: string;
  bankName?: string;
  userRole?: string;
  systemRole?: 'Admin' | 'Maker' | 'Checker' | string;
  loginBranch?: string;
  designation?: string;
  branch?: string;
  idleTimeoutMinutes?: number;
}

export interface LoginRequest {
  loginId: string;
  password: string;
  role: Role;
  /** Required for bank roles - which bank the person is signing in to */
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
  /** true -> localStorage ("Remember this device"), false -> sessionStorage */
  remember: boolean;
}
