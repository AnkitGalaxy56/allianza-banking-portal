export interface BankThemeColors {
  primary: string;
  primaryDark: string;
  /** Very light tint of the primary colour (active menu item, icon tiles) */
  primaryTint: string;
  secondary?: string;
  /** Background of the left panel on the login page (defaults to primaryDark) */
  authPanel?: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
}

/** Everything that makes one bank look different from another. */
export interface BankTheme {
  /** Unique bank code, e.g. "sample-urban" (also used as subdomain / ?bank= value) */
  code: string;
  name: string;
  shortName: string;
  tagline?: string;
  /** Absolute URL or data URI. Falls back to a bank icon when empty. */
  logoUrl?: string;
  fontFamily?: string;
  borderRadius?: number;
  colors: BankThemeColors;
  /** Optional extra CSS for this bank. Injected at runtime (see docs/THEMING.md). */
  customCss?: string;
}
