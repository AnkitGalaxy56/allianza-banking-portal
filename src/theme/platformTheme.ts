import type { BankTheme } from '@/types/theme';

/** Allianza's own look - used for the Allianza admin and as the fallback when a bank theme is unavailable. */
export const ALLIANZA_THEME: BankTheme = {
  code: 'allianza',
  name: 'Allianza',
  shortName: 'Allianza',
  tagline: 'Infoway pvt. ltd.',
  // colors: {
  //   primary: '#2D4DD0',
  //   primaryDark: '#0E1F5C',
  //   primaryTint: '#E1E7FB',
  //   authPanel: '#0E1F5C',
  //   background: '#F3F5FA',
  //   surface: '#FFFFFF',
  //   textPrimary: '#0F1B2D',
  //   textSecondary: '#5B6B7F',
  //   border: '#D0D7E5',
  // },
  
colors: {
  primary: '#0B453B',
  primaryDark: '#08352D',
  primaryTint: '#E5F0EB',
  authPanel: '#08352D',
  background: '#F5F6F2',
  surface: '#FFFFFF',
  textPrimary: '#15352D',
  textSecondary: '#5B6B63',
  border: '#D8E1DA',
},
  mobileColors: {
    primary: '#0B453B', primaryDark: '#08352D', primaryTint: '#E5F0EB',
    authPanel: '#08352D', background: '#F5F6F2', surface: '#FFFFFF',
    textPrimary: '#15352D', textSecondary: '#5B6B63', border: '#D8E1DA',
  },
};
