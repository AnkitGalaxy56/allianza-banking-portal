import { useEffect, useMemo, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { applyBrandToDocument } from './applyBrand';
import { createBankTheme } from './createBankTheme';

/** Reads the active bank theme from Redux and applies it to MUI, CSS variables and custom CSS. */
export default function BankThemeProvider({ children }: { children: ReactNode }) {
  const bankTheme = useAppSelector((state) => state.theme.theme);
  const muiTheme = useMemo(() => createBankTheme(bankTheme), [bankTheme]);

  useEffect(() => {
    applyBrandToDocument(bankTheme);
  }, [bankTheme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
