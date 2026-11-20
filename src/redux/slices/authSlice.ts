import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/services/api/apiError';
import { env } from '@/config/env';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';
import type { LoginRequest, LoginResponse, PendingLoginResponse, PortalType, RefreshResponse, User } from '@/types/auth';
import { clearSession, loadSession, saveSession } from '@/utils/authStorage';
import { isTokenExpired } from '@/utils/jwt';

export type RequestState = 'idle' | 'loading' | 'failed';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** Portal is selected from the login URL, never from the user's role. */
  portalType: PortalType | null;
  status: RequestState;
  error: string | null;
  otpPending: boolean;
  pendingAuth: PendingLoginResponse | null;
  rememberPending: boolean;
  pendingBankCode: string | null;
  pendingPortalType: PortalType | null;
  sessionEndReason: string | null;
}

function getInitialState(): AuthState {
  const empty: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    portalType: null,
    status: 'idle',
    error: null,
    otpPending: false,
    pendingAuth: null,
    rememberPending: false,
    pendingBankCode: null,
    pendingPortalType: null,
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
    portalType: session.portalType ?? (session.user.bankCode ? 'BANK' : 'ALLIANZA'),
  };
}

export type LoginArgs = LoginRequest & { remember: boolean };

export const login = createAsyncThunk<
  PendingLoginResponse,
  LoginArgs,
  { rejectValue: string }
>(
  'auth/login',
  async ({ remember: _remember, portalType: _portalType, ...credentials }, { rejectWithValue }) => {
    try {
      return await authService.login({ ...credentials, portalType: _portalType });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to sign in. Please try again.'));
    }
  },
);

function userFromProfile(profile: Awaited<ReturnType<typeof profileService.getCurrent>>, authenticated: LoginResponse, bankCode?: string): User {
  return {
    id: profile.id || authenticated.user.id,
    name: profile.fullName || authenticated.user.name,
    email: profile.email || authenticated.user.email,
    loginId: profile.userName || authenticated.user.loginId,
    userRole: profile.userRole,
    // Compatibility only. Portal routing does NOT use this field.
    role: profile.userRole,
    bankCode: bankCode ?? authenticated.user.bankCode,
    bankName: profile.organizationName || authenticated.user.bankName,
    loginBranch: profile.loginBranch,
    designation: profile.designation,
    branch: profile.loginBranch,
    idleTimeoutMinutes: profile.sessionTimeoutSeconds ? Math.max(1, Math.round(profile.sessionTimeoutSeconds / 60)) : undefined,
  };
}

export const verifyLoginOtp = createAsyncThunk<
  LoginResponse & { user: User; portalType: PortalType },
  { otp: string },
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/verifyLoginOtp',
  async ({ otp }, { getState, rejectWithValue }) => {
    const { pendingAuth, rememberPending, pendingBankCode, pendingPortalType } = getState().auth;

    if (!pendingAuth || !pendingPortalType) {
      return rejectWithValue('Please sign in again.');
    }

    try {
      const authenticated = await authService.verifyOtp({ challengeId: pendingAuth.challengeId, otp });

      // IMPORTANT:
      // The portal is already known from the URL used for login.
      // The user's actual role is read from /auth/profile after OTP.
      const profile = env.useMockApi
        ? await profileService.getCurrent(authenticated.user)
        : await profileService.getCurrentWithToken(authenticated.accessToken);
      const normalizedUser = userFromProfile(profile, authenticated, pendingBankCode ?? undefined);

      const result = {
        ...authenticated,
        user: normalizedUser,
        portalType: pendingPortalType,
      };

      const idleKey = `allianza.session.idle.${normalizedUser.id}`;
      window.localStorage.removeItem(idleKey);
      window.sessionStorage.removeItem(idleKey);

      saveSession({
        user: normalizedUser,
        accessToken: authenticated.accessToken,
        refreshToken: authenticated.refreshToken,
        portalType: pendingPortalType,
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
    if (!getState().auth.sessionEndReason) dispatch(sessionCleared());
  },
);

const emptyAuthState = () => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  portalType: null,
  status: 'idle' as RequestState,
  error: null,
  otpPending: false,
  pendingAuth: null,
  rememberPending: false,
  pendingBankCode: null,
  pendingPortalType: null,
  sessionEndReason: null,
});

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState,
  reducers: {
    sessionCleared: emptyAuthState,
    sessionExpired: () => ({
      ...emptyAuthState(),
      error: 'Your session has expired. Please sign in again.',
      sessionEndReason: 'Your session has expired. Please sign in again.',
    }),
    sessionReplaced: () => ({
      ...emptyAuthState(),
      sessionEndReason: 'You have logged in on another device. This session will be logged out.',
    }),
    dismissSessionEnd: (state) => { state.sessionEndReason = null; },
    tokensRefreshed: (state, action: PayloadAction<RefreshResponse>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) state.refreshToken = action.payload.refreshToken;
    },
    clearAuthError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.otpPending = false;
        state.pendingAuth = null;
        state.rememberPending = false;
        state.pendingBankCode = action.meta.arg.bankCode ?? null;
        state.pendingPortalType = action.meta.arg.portalType;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.sessionEndReason = null;
        state.otpPending = true;
        state.pendingAuth = action.payload;
        state.rememberPending = action.meta.arg.remember;
        state.pendingBankCode = action.meta.arg.bankCode ?? null;
        state.pendingPortalType = action.meta.arg.portalType;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.portalType = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to sign in. Please try again.';
        state.otpPending = false;
        state.pendingAuth = null;
        state.rememberPending = false;
        state.pendingBankCode = null;
        state.pendingPortalType = null;
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
        state.portalType = action.payload.portalType;
        state.otpPending = false;
        state.pendingAuth = null;
        state.rememberPending = false;
        state.pendingBankCode = null;
        state.pendingPortalType = null;
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
export const selectPortalType = (state: WithAuth) => state.auth.portalType;
export const selectIsAuthenticated = (state: WithAuth) => Boolean(state.auth.user && state.auth.accessToken);
