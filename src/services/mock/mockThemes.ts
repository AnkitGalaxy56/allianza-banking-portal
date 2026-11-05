import type { BankTheme } from '@/types/theme';
import { ALLIANZA_THEME } from '@/theme/platformTheme';
import { delay } from '@/utils/delay';

/**
 * Sample bank themes for development. In production these come from the backend
 * (GET /banks/:code/theme) and are managed by Allianza admins.
 */
export const BANK_THEMES: Record<string, BankTheme> = {
  allianza: ALLIANZA_THEME,
  'sample-urban': {
    code: 'sample-urban',
    name: 'Sample Urban Co-op Bank',
    shortName: 'Sample Urban',
    tagline: 'Banking made simple',
    colors: {
      primary: '#0D6E67',
      primaryDark: '#08403E',
      primaryTint: '#DAEFEA',
      authPanel: '#08403E',
      background: '#F2F5F6',
      surface: '#FFFFFF',
      textPrimary: '#0F1B2D',
      textSecondary: '#5B6B7F',
      border: '#C9D6D8',
    },
  },
  'demo-sahakari': {
    code: 'demo-sahakari',
    name: 'Demo Sahakari Bank',
    shortName: 'Demo Sahakari',
    tagline: 'Your trusted partner',
    borderRadius: 8,
    colors: {
      primary: '#1E3A8A',
      primaryDark: '#0B1F52',
      primaryTint: '#E0E7FA',
      secondary: '#B7791F',
      authPanel: '#0B1F52',
      background: '#F4F6FB',
      surface: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#5B6475',
      border: '#CBD3E6',
    },
    // Example of bank-specific custom CSS (see docs/THEMING.md)
    // customCss: `
    //   .app-stat-card { border-top: 3px solid var(--brand-secondary); }
    //   .login-panel { background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 55%); }
    // `,
  },
  'nagar-co-op': {
    code: 'nagar-co-op',
    name: 'Nagar Co-op Bank',
    shortName: 'Nagar Co-op',
    tagline: 'Growing together',
    colors: {
      primary: '#9F1239',
      primaryDark: '#4C0519',
      primaryTint: '#FBE4EA',
      authPanel: '#4C0519',
      background: '#FAF5F6',
      surface: '#FFFFFF',
      textPrimary: '#1F1417',
      textSecondary: '#6B5A5F',
      border: '#E3CDD3',
    },
  },
  
  'pune-urban': {
    code: 'pune-urban',
    name: 'Pune Urban Co-operative Bank',
    shortName: 'Pune Urban',
    tagline: 'Banking for a better tomorrow',
    colors: {
      primary: '#F57C00',       // Orange
      primaryDark: '#E65100',   // Dark orange
      primaryTint: '#FFF3E0',   // Light orange
      authPanel: '#E65100',     // Login panel
      background: '#FFF8F1',    // Warm background
      surface: '#FFFFFF',       // White cards
      textPrimary: '#0F1B2D',   // Dark text
      textSecondary: '#5B6B7F', // Secondary text
      border: '#FFD7B0',        // Light orange border
    },
  },
};

const STORAGE_KEY = 'allianza.bankThemes.v1';

export function getMockBankThemes(): BankTheme[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as BankTheme[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* Ignore invalid local development cache and use defaults. */ }
  }
  return Object.values(BANK_THEMES);
}

export function saveMockBankThemes(themes: BankTheme[]): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

export async function mockGetBankTheme(bankCode: string): Promise<BankTheme> {
  await delay(150);
  const theme = getMockBankThemes().find((item) => item.code === bankCode) ?? BANK_THEMES[bankCode];
  if (!theme) throw new Error(`Unknown bank code "${bankCode}"`);
  return theme;
}
