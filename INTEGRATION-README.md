# Frontend API integration notes

The supplied frontend archive contained the `src/` directory only (no `package.json`, Vite config, TypeScript config, `index.html`, or public assets). This deliverable therefore contains the updated source tree plus this integration note; it is not a standalone installable frontend project.

## Changes in `src/`

- Login now calls the portal API and receives an OTP challenge.
- OTP verification calls `POST /auth/verify-otp`; the access token and returned user are stored in the existing session storage helper only after successful verification.
- Existing Axios request interceptor attaches the bearer token to API calls.
- The existing unauthorized response handler clears the session and Redux auth state.
- App-level inactivity logout uses the user's `idleTimeoutMinutes` from `MB001001.idle_timeout` (15 minutes when unset).
- The existing Request Handling service strips the `validation/` prefix so validation queues use the same module endpoints.
- Mock API mode is disabled for this integration.

## Configure

Copy `.env.example` to `.env` in the full Vite project root and set `VITE_API_BASE_URL` to the portal API URL. Merge the updated `src/` directory into the full frontend project archive; preserve the original package/config/public files.

## Request Handling payloads

The generic API accepts the actual SQL column names (snake_case) as JSON fields. The supplied frontend's flexible `fields` record can pass module-specific fields, but forms that currently submit camelCase property names should map them to the SQL column names before sending. The API rejects unknown column names rather than silently writing to the wrong column.
