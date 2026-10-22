/** Creates an UNSIGNED, fake JWT so the app can exercise the real decode/expiry code in dev. */
const b64url = (obj: unknown): string =>
  btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export function createMockJwt(claims: Record<string, unknown>, ttlSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'none', typ: 'JWT' };
  const payload = { ...claims, iat: now, exp: now + ttlSeconds };
  return `${b64url(header)}.${b64url(payload)}.mock-signature`;
}
