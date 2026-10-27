# Allianza Banking Portal

A web-based control panel for the Allianza mobile banking platform. The application supports three user roles, role-based access control, and bank-specific branding.

## User Roles

| Role | Description |
|---|---|
| **Allianza (`SUPER_ADMIN`)** | Manages banks, application users, and platform-wide requests. |
| **Bank Admin (`BANK_ADMIN`)** | Manages branches, customers, service requests, leads, notifications, and banners for their bank. |
| **Bank User (`BANK_USER`)** | Accesses permitted features, including customers, service requests, and lead enquiries. |

Each bank can have its own name, logo, colours, font, and custom CSS.

## Features

- Login with three role options.
- JWT authentication and token handling.
- Remember this device and show/hide password options.
- Role-based dashboards and protected routes.
- Branch management with listing, search, filtering, pagination, add, edit, and view functionality.
- Bank-specific themes and branding.
- Axios API integration with automatic token attachment and refresh handling.
- Redux Toolkit for application state management.
- Mock API support for development.
- Placeholder pages for features that are not yet implemented.

## Tech Stack

- React 18
- TypeScript
- Vite
- Material UI (MUI v5)
- Redux Toolkit and React-Redux
- React Router v6
- Axios
- React Hook Form and Zod
- JWT Decode

## Requirements

- Node.js 18.18 or later
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application runs at `http://localhost:5173`.

## Development Login

When mock mode is enabled, use the following credentials:

| Role | Login ID | Password | Bank |
|---|---|---|---|
| Allianza | `allianza.admin` | `Admin@123` | Platform |
| Bank Admin | `bank.admin` | `Admin@123` | Sample Urban Co-op Bank |
| Bank Admin | `sahakari.admin` | `Admin@123` | Demo Sahakari Bank |
| Bank Admin | `nagar.admin` | `Admin@123` | Nagar Co-op Bank |

These credentials are for local development only. Do not use them in production.

## Bank Theme Preview

To preview different bank themes, use these URLs while the development server is running:

- Sample Urban Co-op Bank: `http://localhost:5173/login?bank=sample-urban`
- Demo Sahakari Bank: `http://localhost:5173/login?bank=demo-sahakari`
- Nagar Co-op Bank: `http://localhost:5173/login?bank=nagar-co-op`

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the code using Prettier |

## Project Structure

```text
src/
├── config/       Environment configuration and role constants
├── types/        Shared TypeScript types
├── redux/        Redux store, hooks, and slices
├── routes/       Routes, navigation, and access control
├── services/     API services and mock API
├── theme/        Bank-specific theming
├── layouts/      Dashboard layout and sidebar
├── pages/        Login, dashboards, branches, and error pages
├── components/   Reusable UI components
├── hooks/        Custom React hooks
├── utils/        Shared utility functions
└── styles/       Global styles
```

## Documentation

| Document | Description |
|---|---|
| `docs/ARCHITECTURE.md` | Application architecture and adding new pages |
| `docs/THEMING.md` | Bank branding and theme configuration |
| `docs/API_CONTRACT.md` | Expected backend API contract |
| `docs/ROADMAP.md` | Planned features and future improvements |

## Connecting the Real API

1. Configure `VITE_USE_MOCK_API=false` in your local environment file.
2. Set `VITE_API_BASE_URL` to your backend API URL.
3. Ensure the backend endpoints and response formats match `docs/API_CONTRACT.md`, or update the API endpoints and TypeScript types accordingly.

**Security:** Never commit environment files containing credentials, tokens, or other secrets.
