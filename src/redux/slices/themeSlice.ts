import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/services/api/apiError';
import { themeService } from '@/services/theme.service';
import { ALLIANZA_THEME } from '@/theme/platformTheme';
import type { BankTheme } from '@/types/theme';

export interface ThemeState {
  /** Code of the theme currently applied (e.g. "allianza", "sample-urban") */
  bankCode: string;
  theme: BankTheme;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ThemeState = {
  bankCode: ALLIANZA_THEME.code,
  theme: ALLIANZA_THEME,
  status: 'idle',
  error: null,
};

type WithTheme = { theme: ThemeState };

export const loadBankTheme = createAsyncThunk<BankTheme, string, { rejectValue: string }>(
  'theme/loadBankTheme',
  async (bankCode, { rejectWithValue }) => {
    try {
      return await themeService.getBankTheme(bankCode);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load bank theme.'));
    }
  },
  {
    // Skip the request when this bank's theme is already applied.
    condition: (bankCode, { getState }) => {
      const { theme } = getState() as WithTheme;
      return !(theme.bankCode === bankCode && theme.status === 'succeeded');
    },
  },
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /** Use Allianza's own look (Allianza admin, or when no bank is known). */
    setPlatformTheme: (state) => {
      state.bankCode = ALLIANZA_THEME.code;
      state.theme = ALLIANZA_THEME;
      state.status = 'succeeded';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBankTheme.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadBankTheme.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bankCode = action.payload.code;
        state.theme = action.payload;
      })
      .addCase(loadBankTheme.rejected, (state, action) => {
        // Keep whatever theme is showing; the app stays usable with the default look.
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load bank theme.';
        state.bankCode = ALLIANZA_THEME.code;
        state.theme = ALLIANZA_THEME;
      });
  },
});

export const { setPlatformTheme } = themeSlice.actions;
export default themeSlice.reducer;

export const selectTheme = (state: WithTheme) => state.theme.theme;
