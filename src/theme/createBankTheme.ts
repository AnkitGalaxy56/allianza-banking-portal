import { alpha, createTheme, type Theme } from '@mui/material/styles';
import type { BankTheme } from '@/types/theme';

export const DEFAULT_FONT_FAMILY =
  "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/** Builds the MUI theme for one bank from its brand settings. */
export function createBankTheme(bank: BankTheme): Theme {
  const { colors } = bank;
  const radius = bank.borderRadius ?? 12;

  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: colors.primary,
        dark: colors.primaryDark,
        light: colors.primaryTint, // used as the soft "tint" background
        contrastText: '#FFFFFF',
      },
      secondary: { main: colors.secondary ?? colors.primaryDark },
      success: { main: '#1F9D55', dark: '#166534' },
      warning: { main: '#D97706', dark: '#92400E' },
      info: { main: '#2563EB', dark: '#1E3A8A' },
      error: { main: '#DC2626', dark: '#991B1B' },
      background: { default: colors.background, paper: colors.surface },
      text: { primary: colors.textPrimary, secondary: colors.textSecondary },
      divider: colors.border,
    },
    shape: { borderRadius: radius },
    typography: {
      fontFamily: bank.fontFamily ?? DEFAULT_FONT_FAMILY,
      h4: { fontWeight: 800, letterSpacing: '-0.01em' },
      h5: { fontWeight: 800 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: Math.max(radius - 2, 4), paddingInline: 18 },
          sizeLarge: { minHeight: 48 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: Math.max(radius - 2, 4),
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiTableCell: {
        styleOverrides: {
          head: ({ theme }) => ({
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: theme.palette.text.secondary,
            backgroundColor: alpha(theme.palette.text.primary, 0.03),
          }),
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: Math.max(radius - 2, 4) } } },
    },
  });
}
