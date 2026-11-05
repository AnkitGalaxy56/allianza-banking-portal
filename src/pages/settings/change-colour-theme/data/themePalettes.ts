import type { BankThemeColors } from '@/types/theme';

const DEFAULT_COLORS: BankThemeColors = {
  primary: '#0B453B', primaryDark: '#08352D', primaryTint: '#E5F0EB',
  authPanel: '#08352D', background: '#F5F6F2', surface: '#FFFFFF',
  textPrimary: '#15352D', textSecondary: '#5B6B63', border: '#D8E1DA',
};

const PRESETS = [
  { name: 'Forest', colors: { ...DEFAULT_COLORS } },
  { name: 'Ocean', colors: { ...DEFAULT_COLORS, primary: '#155E9A', primaryDark: '#103B66', primaryTint: '#E1EFFB', authPanel: '#103B66', background: '#F3F7FC', textPrimary: '#15283D', textSecondary: '#5D7188', border: '#D5E1EF' } },
  { name: 'Royal', colors: { ...DEFAULT_COLORS, primary: '#5B3A9E', primaryDark: '#35205F', primaryTint: '#EEE8FA', authPanel: '#35205F', background: '#F7F5FB', textPrimary: '#251B36', textSecondary: '#6C627B', border: '#E0D9EC' } },
  { name: 'Ruby', colors: { ...DEFAULT_COLORS, primary: '#A52845', primaryDark: '#64152A', primaryTint: '#F9E7EC', authPanel: '#64152A', background: '#FCF5F6', textPrimary: '#321821', textSecondary: '#765B63', border: '#EBD4DB' } },
  { name: 'Amber', colors: { ...DEFAULT_COLORS, primary: '#B65B12', primaryDark: '#713609', primaryTint: '#FFF0DD', authPanel: '#713609', background: '#FFFAF3', textPrimary: '#352719', textSecondary: '#796854', border: '#EEDCC5' } },
];

const COLOR_FIELDS: { key: keyof BankThemeColors; label: string; hint: string }[] = [
  { key: 'primary', label: 'Primary colour', hint: 'Main buttons, links and highlights' },
  { key: 'primaryDark', label: 'Primary dark', hint: 'Dark navigation and hover states' },
  { key: 'primaryTint', label: 'Primary light tint', hint: 'Selected menu and soft highlights' },
  { key: 'authPanel', label: 'Login panel', hint: 'Login screen accent background' },
  { key: 'background', label: 'Page background', hint: 'Main application background' },
  { key: 'surface', label: 'Card / surface', hint: 'Cards, dialogs and table surfaces' },
  { key: 'textPrimary', label: 'Primary text', hint: 'Headings and main content' },
  { key: 'textSecondary', label: 'Secondary text', hint: 'Descriptions and helper text' },
  { key: 'border', label: 'Border colour', hint: 'Dividers, outlines and input borders' },
];


export { DEFAULT_COLORS, PRESETS, COLOR_FIELDS };
