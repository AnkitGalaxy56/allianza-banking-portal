import { useEffect, useRef, useState } from 'react';
import FullPageLoader from '@/components/common/FullPageLoader';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { dismissSessionEnd, logoutUser, selectPortalType, selectUser } from '@/redux/slices/authSlice';
import { authService } from '@/services/auth.service';
import { loadBankTheme, loadPlatformTheme } from '@/redux/slices/themeSlice';
import AppRoutes from '@/routes/AppRoutes';
import BankThemeProvider from '@/theme/BankThemeProvider';
import { loadSession } from '@/utils/authStorage';

const IDLE_LIMIT_MS = 3 * 60 * 1000;
const WARNING_LIMIT_MS = 3 * 60 * 1000;
const IDLE_STORAGE_PREFIX = 'allianza.session.idle.';

type PersistedIdleState = { lastActivityAt: number; warningStartedAt: number | null };

function idleStorage(): Storage {
  const session = loadSession();
  return session?.remember ? window.localStorage : window.sessionStorage;
}

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const portalType = useAppSelector(selectPortalType);
  const sessionEndReason = useAppSelector((state) => state.auth.sessionEndReason);
  const themeState = useAppSelector((state) => state.theme);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [confirmLoginId, setConfirmLoginId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [lastActivity, setLastActivity] = useState(() => Date.now());
  const [warningStartedAt, setWarningStartedAt] = useState<number | null>(null);
  const [idleStateReady, setIdleStateReady] = useState(false);

  // Validate the server session immediately on app startup (including page refresh),
  // then continue checking every 10 seconds for a login from another device.
  useEffect(() => {
    if (!user) return;
    const check = () => {
      void authService.checkSession().catch(() => {
        // The shared API interceptor handles expired/revoked/replaced sessions.
      });
    };
    check();
    const interval = window.setInterval(check, 10_000);
    return () => window.clearInterval(interval);
  }, [user?.id]);

  // Restore the idle/warning timestamps after a browser refresh. This prevents
  // refreshing the page from restarting either three-minute period.
  useEffect(() => {
    if (!user) {
      setIdleStateReady(false);
      setShowIdleWarning(false);
      setWarningStartedAt(null);
      return;
    }

    const storage = idleStorage();
    const key = `${IDLE_STORAGE_PREFIX}${user.id}`;
    let saved: PersistedIdleState | null = null;
    try {
      const raw = storage.getItem(key);
      if (raw) saved = JSON.parse(raw) as PersistedIdleState;
    } catch {
      saved = null;
    }

    const now = Date.now();
    const activityAt = saved && Number.isFinite(saved.lastActivityAt) ? saved.lastActivityAt : now;
    let warningAt = saved?.warningStartedAt ?? null;

    if (warningAt === null && now - activityAt >= IDLE_LIMIT_MS) {
      warningAt = activityAt + IDLE_LIMIT_MS;
    }

    if (warningAt !== null && warningAt + WARNING_LIMIT_MS <= now) {
      storage.removeItem(key);
      setIdleStateReady(false);
      setShowIdleWarning(false);
      setWarningStartedAt(null);
      void dispatch(logoutUser());
      return;
    }

    setLastActivity(activityAt);
    setWarningStartedAt(warningAt);
    setShowIdleWarning(warningAt !== null);
    if (warningAt !== null) {
      setSecondsLeft(Math.max(0, Math.ceil((warningAt + WARNING_LIMIT_MS - now) / 1000)));
    } else {
      setSecondsLeft(180);
    }
    setIdleStateReady(true);
  }, [user?.id, dispatch]);

  // Persist timestamps in the same browser storage area as the auth session.
  useEffect(() => {
    if (!user || !idleStateReady) return;
    const key = `${IDLE_STORAGE_PREFIX}${user.id}`;
    const state: PersistedIdleState = { lastActivityAt: lastActivity, warningStartedAt };
    idleStorage().setItem(key, JSON.stringify(state));
  }, [user?.id, idleStateReady, lastActivity, warningStartedAt]);

  // Normal interaction resets the idle clock only before the warning appears.
  useEffect(() => {
    if (!user || !idleStateReady) return;
    const onActivity = () => {
      if (showIdleWarning) return;
      setLastActivity(Date.now());
      setWarningStartedAt(null);
    };
    const events: (keyof WindowEventMap)[] = [
      'pointerdown', 'pointermove', 'keydown', 'mousemove', 'touchstart', 'scroll', 'wheel',
    ];
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, onActivity));
  }, [user?.id, idleStateReady, showIdleWarning]);

  // Start the warning at the persisted idle deadline, not at a fresh 3-minute delay.
  useEffect(() => {
    if (!user || !idleStateReady || showIdleWarning) return;
    const delay = Math.max(0, lastActivity + IDLE_LIMIT_MS - Date.now());
    const timer = window.setTimeout(() => {
      const startedAt = lastActivity + IDLE_LIMIT_MS;
      setWarningStartedAt(startedAt);
      setShowIdleWarning(true);
      setConfirmLoginId(user.loginId ?? user.email ?? '');
      setConfirmPassword('');
      setConfirmError('');
    }, delay);
    return () => window.clearTimeout(timer);
  }, [user?.id, idleStateReady, lastActivity, showIdleWarning]);

  // Count down to an absolute deadline so refreshing cannot extend the warning.
  useEffect(() => {
    if (!user || !showIdleWarning || warningStartedAt === null) return;
    const deadline = warningStartedAt + WARNING_LIMIT_MS;
    let loggingOut = false;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0 && !loggingOut) {
        loggingOut = true;
        setShowIdleWarning(false);
        void dispatch(logoutUser());
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [user?.id, showIdleWarning, warningStartedAt, dispatch]);

  const staySignedIn = async () => {
    if (!user || confirmBusy) return;
    setConfirmBusy(true);
    setConfirmError('');
    try {
      await authService.verifySession({ loginId: confirmLoginId, password: confirmPassword });
      setShowIdleWarning(false);
      setWarningStartedAt(null);
      setSecondsLeft(180);
      setConfirmPassword('');
      setLastActivity(Date.now());
    } catch (e) {
      setConfirmError(e instanceof Error ? e.message : 'Credential verification failed.');
    } finally {
      setConfirmBusy(false);
    }
  };

  // Remove idle metadata only when the authenticated user is cleared. Do not
  // use an unmount cleanup here: a browser refresh must preserve the timestamps.
  const previousUserId = useRef<string | null>(null);
  useEffect(() => {
    if (user) {
      previousUserId.current = user.id;
      return;
    }
    if (previousUserId.current) {
      const key = `${IDLE_STORAGE_PREFIX}${previousUserId.current}`;
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
      previousUserId.current = null;
    }
  }, [user?.id]);

  // Once someone is signed in, make sure their bank's look is loaded (also after a page refresh).
  useEffect(() => {
    if (!user || !portalType) return;
    if (portalType === 'ALLIANZA') {
      void dispatch(loadPlatformTheme());
    } else if (user.bankCode) {
      void dispatch(loadBankTheme(user.bankCode));
    }
  }, [user, portalType, dispatch]);

  const themeReady =
    !user ||
    themeState.status === 'failed' ||
    (portalType === 'ALLIANZA' && themeState.status === 'succeeded' && themeState.bankCode === 'allianza') ||
    (portalType === 'BANK' && !!user.bankCode && themeState.status === 'succeeded' && themeState.bankCode === user.bankCode);

  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return <BankThemeProvider>
    {themeReady ? <AppRoutes /> : <FullPageLoader />}
    <Dialog open={Boolean(sessionEndReason)} onClose={() => dispatch(dismissSessionEnd())} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Session ended</DialogTitle>
      <DialogContent><Alert severity="warning">{sessionEndReason}</Alert></DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button variant="contained" onClick={() => dispatch(dismissSessionEnd())}>Continue to Login</Button></DialogActions>
    </Dialog>
    <Dialog open={showIdleWarning && Boolean(user)} onClose={() => undefined} disableEscapeKeyDown fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Session timeout warning</DialogTitle>
      <DialogContent>
        <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
          <Alert severity="warning" sx={{ width: '100%' }}>You have been inactive for 3 minutes. Verify your credentials within the next 3 minutes to continue.</Alert>
          <Typography color="text.secondary">Are you still there?</Typography>
          <Typography aria-live="polite" sx={{ fontSize: 38, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: 2 }}>{timerText}</Typography>
          <Typography variant="body2" color="text.secondary">Enter your Login ID and password, then select “I am here” to continue.</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
          <input aria-label="Login ID" placeholder="Login ID" value={confirmLoginId} onChange={e => setConfirmLoginId(e.target.value)} style={{ padding: 12, font: 'inherit', borderRadius: 8, border: '1px solid #bdbdbd' }} />
          <input aria-label="Password" placeholder="Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ padding: 12, font: 'inherit', borderRadius: 8, border: '1px solid #bdbdbd' }} />
          {confirmError && <Alert severity="error">{confirmError}</Alert>}
          <Button fullWidth size="large" variant="contained" onClick={staySignedIn} disabled={confirmBusy || !confirmLoginId || !confirmPassword} autoFocus>{confirmBusy ? 'Verifying…' : 'I am here'}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  </BankThemeProvider>;
}
