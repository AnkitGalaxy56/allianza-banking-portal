import type { AuthSession } from '@/types/auth';

const KEY = 'allianza.auth.session';

/**
 * Persists the login session.
 * - "Remember this device" ticked  -> localStorage   (survives browser restart)
 * - not ticked                     -> sessionStorage (cleared when the tab closes)
 *
 * SECURITY NOTE: any JS-readable storage is exposed to XSS. For production, prefer keeping the
 * refresh token in an httpOnly, Secure, SameSite cookie set by the backend (see docs/ROADMAP.md).
 */
export function saveSession(session: AuthSession): void {
  clearSession();
  const store = session.remember ? window.localStorage : window.sessionStorage;
  store.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(KEY) ?? window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function updateSessionTokens(accessToken: string, refreshToken?: string): void {
  const session = loadSession();
  if (!session) return;
  saveSession({ ...session, accessToken, refreshToken: refreshToken ?? session.refreshToken });
}

export function clearSession(): void {
  window.localStorage.removeItem(KEY);
  window.sessionStorage.removeItem(KEY);
}
