import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/services/api/apiError';
import { authService } from '@/services/auth.service';
import type { LoginRequest, LoginResponse, RefreshResponse, User } from '@/types/auth';
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
  pendingAuth: LoginResponse | null;
  rememberPending: boolean;
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
  LoginResponse,
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

export const verifyMockOtp = createAsyncThunk<
  LoginResponse,
  { otp: string },
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/verifyMockOtp',
  async ({ otp }, { getState, rejectWithValue }) => {
    const { pendingAuth, rememberPending } = getState().auth;

    if (!pendingAuth) {
      return rejectWithValue('Please sign in again.');
    }

    // Development/demo only. Replace with backend OTP verification in production.
    if (otp !== '123456') {
      return rejectWithValue('Invalid OTP. Please try again.');
    }

    saveSession({
      user: pendingAuth.user,
      accessToken: pendingAuth.accessToken,
      refreshToken: pendingAuth.refreshToken,
      remember: rememberPending,
    });

    return pendingAuth;
  },
);

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async (_arg, { dispatch }) => {
    try {
      await authService.logout();
    } catch {
      // Always clear the local session, even if the API call fails.
    }

    clearSession();
    dispatch(sessionCleared());
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
    }),

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
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.otpPending = true;
        state.pendingAuth = action.payload;
        state.rememberPending = action.meta.arg.remember;

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
      })
      .addCase(verifyMockOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyMockOtp.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.otpPending = false;
        state.pendingAuth = null;
        state.rememberPending = false;
      })
      .addCase(verifyMockOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'OTP verification failed.';
      });
  },
});

export const {
  sessionCleared,
  sessionExpired,
  tokensRefreshed,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;

type WithAuth = { auth: AuthState };

export const selectAuth = (state: WithAuth) => state.auth;
export const selectUser = (state: WithAuth) => state.auth.user;
export const selectIsAuthenticated = (state: WithAuth) =>
  Boolean(state.auth.user && state.auth.accessToken);
