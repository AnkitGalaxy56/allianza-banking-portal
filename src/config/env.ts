/**
 * Single place that reads environment variables.
 * `useMockApi` can only be true in `npm run dev` - it is always false in production builds.
 */
export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Allianza Banking Portal',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 20000),
  defaultBankCode: import.meta.env.VITE_DEFAULT_BANK_CODE ?? 'sample-urban',
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
  // Real API only. Mock/demo data is intentionally disabled for this integration build.
  //useMockApi: false,
} as const;
