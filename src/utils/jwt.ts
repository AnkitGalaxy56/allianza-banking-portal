import { jwtDecode } from 'jwt-decode';

export interface TokenPayload {
  exp?: number; // seconds since epoch
  sub?: string;
  role?: string;
  [claim: string]: unknown;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

/** true when the token is unreadable or already expired (with a small safety margin). */
export function isTokenExpired(token: string, skewSeconds = 10): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  if (!payload.exp) return false; // no exp claim -> let the server decide
  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}
