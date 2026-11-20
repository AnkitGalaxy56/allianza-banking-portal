const RESERVED_SUBDOMAINS = ['www', 'app', 'admin', 'portal', 'localhost'];

/**
 * Resolves the bank portal only from the current URL.
 *
 * /login                         -> Allianza platform login
 * /login?bank=sample-urban      -> Sample Urban bank login
 * sample-urban.portal...        -> Sample Urban bank login
 *
 * There is intentionally no remembered/default-bank fallback here. A direct
 * /login must never silently open a bank portal from an older browser session.
 */
export function resolveBankCode(): string | null {
  const fromQuery = new URLSearchParams(window.location.search).get('bank')?.trim();
  if (fromQuery) return fromQuery;

  const parts = window.location.hostname.split('.');
  if (parts.length >= 3 && !RESERVED_SUBDOMAINS.includes(parts[0])) {
    return parts[0];
  }

  return null;
}
