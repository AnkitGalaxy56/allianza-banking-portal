import type { Role } from '@/config/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Not set for SUPER_ADMIN */
  bankCode?: string;
  bankName?: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
  role: Role;
  /** Required for bank roles - which bank the person is signing in to */
  bankCode?: string;
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
