import type { BankTheme } from '@/types/theme';

const STYLE_ELEMENT_ID = 'bank-custom-css';

/**
 * Basic safety net for bank-supplied CSS. It is NOT a full sanitiser - only trusted Allianza admins
 * should be able to edit `customCss`, and production should also set a strict Content-Security-Policy.
 */
export function sanitizeCss(css: string): string {
  return css
    .replace(/<\/?style[^>]*>/gi, '')
    .replace(/@import[^;]*;?/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/behavior\s*:/gi, '')
    .replace(/-moz-binding\s*:/gi, '');
}

/** Maps a bank theme to CSS custom properties (usable in any CSS: `var(--brand-primary)`). */
export function themeToCssVariables(theme: BankTheme): Record<string, string> {
  const c = theme.colors;
  return {
    '--brand-primary': c.primary,
    '--brand-primary-dark': c.primaryDark,
    '--brand-primary-tint': c.primaryTint,
    '--brand-secondary': c.secondary ?? c.primaryDark,
    '--brand-auth-panel': c.authPanel ?? c.primaryDark,
    '--brand-background': c.background,
    '--brand-surface': c.surface,
    '--brand-text': c.textPrimary,
    '--brand-text-muted': c.textSecondary,
    '--brand-border': c.border,
    '--brand-radius': `${theme.borderRadius ?? 12}px`,
  };
}

/** Pushes the bank's brand into the page: CSS variables, data-bank attribute, <style> tag, title. */
export function applyBrandToDocument(theme: BankTheme): void {
  const root = document.documentElement;

  Object.entries(themeToCssVariables(theme)).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
  root.setAttribute('data-bank', theme.code);

  let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
  if (theme.customCss?.trim()) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ELEMENT_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = sanitizeCss(theme.customCss);
  } else if (styleEl) {
    styleEl.remove();
  }

  document.title = `${theme.shortName} Portal`;
}
