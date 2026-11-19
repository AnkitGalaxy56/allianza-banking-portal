import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/services/api/apiError';
import { authService } from '@/services/auth.service';
import type { LoginRequest, LoginResponse, PendingLoginResponse, RefreshResponse, User } from '@/types/auth';
import { clearSession, loadSession, saveSession } from '@/utils/authStorage';
import { isTokenExpired } from '@/utils/jwt';

export type RequestState = 'idle' | 'loading' | 'failed';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: RequestState;
  error: string | null;
  otpPending: boolean;
  pendingAuth: PendingLoginResponse | null;
  rememberPending: boolean;
  pendingBankCode: string | null;
  sessionEndReason: string | null;
}

function getInitialState(): AuthState {
  const empty: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    status: 'idle',
    error: null,
    otpPending: false,
    pendingAuth: null,
    rememberPending: false,
    pendingBankCode: null,
    sessionEndReason: null,
  };

  const session = loadSession();
  if (!session) return empty;

  const usable = !isTokenExpired(session.accessToken) || Boolean(session.refreshToken);

  if (!usable) {
    clearSession();
    return empty;
  }

  return {
    ...empty,
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken ?? null,
  };
}

export type LoginArgs = LoginRequest & { remember: boolean };

export const login = createAsyncThunk<
  PendingLoginResponse,
  LoginArgs,
  { rejectValue: string }
>(
  'auth/login',
  async ({ remember: _remember, ...credentials }, { rejectWithValue }) => {
    try {
      // Login validates credentials, but does not save an authenticated session.
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Unable to sign in. Please try again.'),
      );
    }
  },
);

export const verifyLoginOtp = createAsyncThunk<
  LoginResponse,
  { otp: string },
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/verifyLoginOtp',
  async ({ otp }, { getState, rejectWithValue }) => {
    const { pendingAuth, rememberPending, pendingBankCode } = getState().auth;

    if (!pendingAuth) {
      return rejectWithValue('Please sign in again.');
    }

    try {
      const authenticated = await authService.verifyOtp({ challengeId: pendingAuth.challengeId, otp });
      // The portal API identifies the user's role, while the bank code is selected
      // from the bank portal URL/configuration during login.
      const apiRole = String(authenticated.user.userRole ?? authenticated.user.role ?? '').toUpperCase();
      const normalizedUser = {
        ...authenticated.user,
        role: apiRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' as const
          : apiRole.includes('ADMIN') ? 'BANK_ADMIN' as const : 'BANK_USER' as const,
        bankCode: authenticated.user.bankCode ?? pendingBankCode ?? undefined,
      };
      const result = { ...authenticated, user: normalizedUser };
      // A fresh successful login starts a new inactivity window for this user.
      const idleKey = `allianza.session.idle.${normalizedUser.id}`;
      window.localStorage.removeItem(idleKey);
      window.sessionStorage.removeItem(idleKey);
      saveSession({
        user: normalizedUser,
        accessToken: authenticated.accessToken,
        refreshToken: authenticated.refreshToken,
        remember: rememberPending,
      });
      return result;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'OTP verification failed.'));
    }
  },
);

export const logoutUser = createAsyncThunk<void, void, { state: { auth: AuthState } }>(
  'auth/logoutUser',
  async (_arg, { dispatch, getState }) => {
    try {
      await authService.logout();
    } catch {
      // Always clear the local session, even if the API call fails.
    }

    clearSession();
    // A 401 may have identified a replacement login while logout was in flight.
    // Preserve that specific session-ended message instead of overwriting it.
    if (!getState().auth.sessionEndReason) dispatch(sessionCleared());
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState,
  reducers: {
    sessionCleared: () => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle' as RequestState,
      error: null,
      otpPending: false,
      pendingAuth: null,
      rememberPending: false,
      pendingBankCode: null,
      sessionEndReason: null,
    }),

    sessionExpired: () => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle' as RequestState,
      error: 'Your session has expired. Please sign in again.',
      otpPending: false,
      pendingAuth: null,
      rememberPending: false,
      pendingBankCode: null,
      sessionEndReason: 'Your session has expired. Please sign in again.',
    }),

    sessionReplaced: () => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle' as RequestState,
      error: null,
      otpPending: false,
      pendingAuth: null,
      rememberPending: false,
      pendingBankCode: null,
      sessionEndReason: 'You have logged in on another device. This session will be logged out.',
    }),

    dismissSessionEnd: (state) => {
      state.sessionEndReason = null;
    },

    tokensRefreshed: (state, action: PayloadAction<RefreshResponse>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.otpPending = false;
        state.pendingAuth = null;
        state.rememberPending = false;
        state.pendingBankCode = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.sessionEndReason = null;
        state.otpPending = true;
        state.pendingAuth = action.payload;
        state.rememberPending = action.meta.arg.remember;
        state.pendingBankCode = action.meta.arg.bankCode ?? null;

        // Do not set user/accessToken until OTP is verified.
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to sign in. Please try again.';
        state.otpPending = false;
        state.pendingAuth = null;
        state.rememberPending = false;
        state.pendingBankCode = null;
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.otpPending = false;
        state.pendingAuth = null;
        state.rememberPending = false;
        state.pendingBankCode = null;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'OTP verification failed.';
      });
  },
});

export const {
  sessionCleared,
  sessionExpired,
  sessionReplaced,
  dismissSessionEnd,
  tokensRefreshed,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;

type WithAuth = { auth: AuthState };

export const selectAuth = (state: WithAuth) => state.auth;
export const selectUser = (state: WithAuth) => state.auth.user;
export const selectIsAuthenticated = (state: WithAuth) =>
  Boolean(state.auth.user && state.auth.accessToken);
