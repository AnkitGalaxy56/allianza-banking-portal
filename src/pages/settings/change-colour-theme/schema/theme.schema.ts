import type { BankThemeColors } from '@/types/theme';
import { COLOR_FIELDS } from '../data/themePalettes';

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function isValidThemePalette(colors: BankThemeColors): boolean {
  return COLOR_FIELDS.every(({ key }) => HEX_COLOR_PATTERN.test(colors[key] || ''));
}

export function isValidThemeIdentity(value: { code: string; name: string; shortName: string }): boolean {
  return Boolean(value.code.trim() && value.name.trim() && value.shortName.trim());
}
