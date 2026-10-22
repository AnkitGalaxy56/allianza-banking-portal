import { env } from '@/config/env';

const STORAGE_KEY = 'allianza.bankCode';
const RESERVED_SUBDOMAINS = ['www', 'app', 'admin', 'portal', 'localhost'];

/**
 * Works out which bank's portal this browser is looking at, in this order:
 *  1. ?bank=sample-urban in the URL (handy in development, remembered for the tab)
 *  2. sub-domain, e.g. sample-urban.portal.allianza.com
 *  3. value remembered for this tab
 *  4. VITE_DEFAULT_BANK_CODE
 */
export function resolveBankCode(): string | null {
  const fromQuery = new URLSearchParams(window.location.search).get('bank');
  if (fromQuery) {
    window.sessionStorage.setItem(STORAGE_KEY, fromQuery);
    return fromQuery;
  }

  const parts = window.location.hostname.split('.');
  if (parts.length >= 3 && !RESERVED_SUBDOMAINS.includes(parts[0])) {
    return parts[0];
  }

  return window.sessionStorage.getItem(STORAGE_KEY) || env.defaultBankCode || null;
}
