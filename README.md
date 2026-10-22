# Allianza Banking Portal

Web control panel for the **Allianza mobile-banking platform**. One React app serves three kinds of
people, each with their own menu and dashboard, and every bank gets its **own name, logo and colour theme**.

## What is built

- Login page with the 3-way login switch, JWT handling, "Remember this device", show/hide password
- Role-based dashboards (Allianza dashboard from slide 14; Bank dashboard from the *Bank Admin - Dashboard* image)
- **Branches** page (list, search, filter, paging, add/edit form, view) from the *Bank Admin - Branches* image
- Per-bank theming: colours, logo, name, font and optional custom CSS
- Protected routes + role guards; every other menu item shows a "Coming soon" placeholder
- Axios instance with automatic token attach + refresh, Redux store, mock API for development

## Quick start

Requirements: **Node.js 18.18+ (20 LTS recommended)** and npm.

```bash
npm install
npm run dev          # opens http://localhost:5173
```

No backend is needed: `.env.development` sets `VITE_USE_MOCK_API=true`, which switches on temporary logins and fake data.

### Temporary development logins (mock mode only)

| Login type | Login ID | Password | Bank |
|---|---|---|---|
| Allianza | `allianza.admin` | `Admin@123` | - |
| Bank Admin | `bank.admin` | `Admin@123` | Sample Urban Co-op Bank (teal) |
| Bank User | `bank.user` | `User@123` | Sample Urban Co-op Bank |
| Bank Admin | `sahakari.admin` | `Admin@123` | Demo Sahakari Bank (navy) |
| Bank Admin | `nagar.admin` | `Admin@123` | Nagar Co-op Bank (maroon) |

The login page lists these too (with a **Use** button) while mock mode is on.

**See bank-wise themes:** pick the bank with a URL parameter, choose *Bank Admin*, sign in:

- `http://localhost:5173/login?bank=sample-urban`
- `http://localhost:5173/login?bank=demo-sahakari`
- `http://localhost:5173/login?bank=nagar-co-op`

In production the bank comes from the sub-domain (e.g. `sample-urban.portal.yourdomain.com`).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Tech stack

React 18 + TypeScript (strict) - Vite - MUI v5 - Redux Toolkit + React-Redux - React Router v6 - Axios -
react-hook-form + zod (forms/validation) - jwt-decode.

## Folder structure

```
src/
├─ main.tsx, App.tsx          App start-up, theme loading gate
├─ config/                    env.ts (env vars), roles.ts (role constants)
├─ types/                     Shared TypeScript types (auth, theme, branch, dashboard ...)
├─ redux/                     ALL Redux code
│  ├─ store.ts, hooks.ts
│  └─ slices/                 authSlice.ts, themeSlice.ts
├─ routes/                    ALL routing code
│  ├─ AppRoutes.tsx           Route table
│  ├─ navigation.ts           Menu + route access per role (single source of truth)
│  ├─ paths.ts, ProtectedRoute.tsx, PublicOnlyRoute.tsx, RoleGuard.tsx
├─ services/                  ALL API calling code
│  ├─ api/                    axiosInstance.ts, endpoints.ts, apiError.ts
│  ├─ auth.service.ts, theme.service.ts, dashboard.service.ts, branch.service.ts
│  └─ mock/                   Fake API + dev logins (development only)
├─ theme/                     Bank theming (MUI theme builder, CSS variables, custom CSS)
├─ layouts/                   DashboardLayout.tsx, Sidebar.tsx
├─ pages/                     auth/, dashboard/, branches/, errors/
├─ components/                common/ (StatCard, StatusChip ...), form/, auth/
├─ hooks/                     useAsyncData, useDebouncedValue
├─ utils/                     authStorage, jwt, bank (bank resolution), format, delay
└─ styles/global.css          Default brand CSS variables
```
