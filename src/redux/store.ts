import { configureStore } from '@reduxjs/toolkit';
import { registerAuthHandlers } from '@/services/api/axiosInstance';
import { clearSession } from '@/utils/authStorage';
import authReducer, { sessionExpired, tokensRefreshed } from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import requestHandlingReducer from './slices/requestHandlingSlice';
import mastersReducer from './slices/mastersSlice';
import mobileUtilitiesReducer from './slices/mobileUtilitiesSlice';
import userManagementReducer from './slices/userManagementSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    requestHandling: requestHandlingReducer,
    masters: mastersReducer,
    mobileUtilities: mobileUtilitiesReducer,
    userManagement: userManagementReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Let the axios instance talk to Redux without importing the store itself.
registerAuthHandlers({
  onTokensRefreshed: (tokens) => {
    store.dispatch(tokensRefreshed(tokens));
  },
  onUnauthorized: () => {
    clearSession();
    store.dispatch(sessionExpired());
  },
});
