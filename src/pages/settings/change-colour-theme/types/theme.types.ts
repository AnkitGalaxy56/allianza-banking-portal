import type { BankTheme } from '@/types/theme';

export interface ThemeFormDialogProps {
  open: boolean;
  theme: BankTheme | null;
  onClose: () => void;
  onSave: (theme: BankTheme, isNew: boolean) => Promise<void>;
}

export interface ThemeFeedback {
  type: 'success' | 'error';
  message: string;
}
