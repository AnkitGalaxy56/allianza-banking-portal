import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import type { RefreshResponse } from '@/types/auth';
import { loadSession, updateSessionTokens } from '@/utils/authStorage';
import { ENDPOINTS } from './endpoints';

/**
 * The ONE axios instance used by every service.
 *  - request : adds `Authorization: Bearer <accessToken>`
 *  - response: on 401 it tries ONE token refresh (all parallel requests share that refresh),
 *              retries the original request, and if that fails tells the app to sign out.
 *
 * It does not import the Redux store (avoids circular imports). The store registers
 * callbacks through `registerAuthHandlers` - see src/redux/store.ts.
 */

interface AuthHandlers {
  onTokensRefreshed?: (tokens: RefreshResponse) => void;
  onUnauthorized?: () => void;
  onSessionReplaced?: () => void;
}

let handlers: AuthHandlers = {};

export function registerAuthHandlers(next: AuthHandlers): void {
  handlers = next;
}

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Public GET routes used to load branding before/after sign-in. */
function isPublicThemeRequest(config: Pick<InternalAxiosRequestConfig, 'url' | 'method'>): boolean {
  if (config.method?.toLowerCase() !== 'get') return false;

  const path = (config.url ?? '').split('?')[0];
  return /^\/themes(?:\/|$)/.test(path)
    || /^\/banks\/[^/]+\/theme$/.test(path);
}

let refreshPromise: Promise<{ token: string | null; message?: string }> | null = null;

async function refreshAccessToken(): Promise<{ token: string | null; message?: string }> {
  const session = loadSession();
  if (!session?.refreshToken) return { token: null };
  try {
    // Plain axios on purpose: must not go through our own interceptors.
    const apiBase = env.apiBaseUrl.replace(/\/+$/, '');
    const { data } = await axios.post<RefreshResponse>(
      `${apiBase}${ENDPOINTS.auth.refresh}`,
      { refreshToken: session.refreshToken },
      { timeout: env.apiTimeoutMs },
    );
    if (!data?.accessToken) return { token: null };
    updateSessionTokens(data.accessToken, data.refreshToken);
    handlers.onTokensRefreshed?.(data);
    return { token: data.accessToken };
  } catch (error) {
    const responseData = (error as AxiosError<{ message?: string; error?: string }>).response?.data;
    return { token: null, message: responseData?.message ?? responseData?.error };
  }
}

api.interceptors.request.use((config) => {
  // Theme bootstrap endpoints are public. Do not attach an old access token:
  // the backend must be able to serve branding even if a prior session expired.
  if (isPublicThemeRequest(config)) {
    config.headers.delete('Authorization');
    return config;
  }

  const session = loadSession();
  if (session?.accessToken) {
    config.headers.set('Authorization', `Bearer ${session.accessToken}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const url = original?.url ?? '';
    const isAuthCall = url.includes(ENDPOINTS.auth.login)
      || url.includes(ENDPOINTS.auth.verifyOtp)
      || url.includes(ENDPOINTS.auth.refresh);
    const isPublicThemeCall = original ? isPublicThemeRequest(original) : false;

    if (error.response?.status === 401 && original && !original._retry && !isAuthCall && !isPublicThemeCall) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const refreshResult = await refreshPromise;
      if (refreshResult.token) {
        original.headers.set('Authorization', `Bearer ${refreshResult.token}`);
        return api(original);
      }
      if (refreshResult.message?.toLowerCase().includes('another device')) {
        handlers.onSessionReplaced?.();
      } else {
        handlers.onUnauthorized?.();
      }
    }
    return Promise.reject(error);
  },
);
