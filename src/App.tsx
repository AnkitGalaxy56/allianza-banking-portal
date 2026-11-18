import { useEffect, useState } from 'react';
import FullPageLoader from '@/components/common/FullPageLoader';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { ROLES } from '@/config/roles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { authService } from '@/services/auth.service';
import { loadBankTheme, loadPlatformTheme } from '@/redux/slices/themeSlice';
import AppRoutes from '@/routes/AppRoutes';
import BankThemeProvider from '@/theme/BankThemeProvider';

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const themeState = useAppSelector((state) => state.theme);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [confirmLoginId, setConfirmLoginId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [lastActivity, setLastActivity] = useState(() => Date.now());

  // Start a three-minute inactivity period and require credentials during a three-minute warning.
  useEffect(() => {
    if (!user || showIdleWarning) return;
    const timer = window.setTimeout(() => {
      setSecondsLeft(180);
      setConfirmLoginId(user.email ?? '');
      setConfirmPassword('');
      setConfirmError('');
      setShowIdleWarning(true);
    }, 3 * 60 * 1000);
    return () => window.clearTimeout(timer);
  }, [user?.id, lastActivity, showIdleWarning]);

  // Normal interaction resets the idle clock, but interaction is deliberately
  // ignored while the warning is visible; only the explicit button keeps the session.
  useEffect(() => {
    if (!user) return;
    const onActivity = () => {
      if (!showIdleWarning) setLastActivity(Date.now());
    };
    const events: (keyof WindowEventMap)[] = [
      'pointerdown', 'pointermove', 'keydown', 'mousemove', 'touchstart', 'scroll', 'wheel',
    ];
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, onActivity));
  }, [user?.id, showIdleWarning]);

  useEffect(() => {
    if (!user || !showIdleWarning) return;
    let remaining = 180;
    const interval = window.setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(interval);
        setShowIdleWarning(false);
        void dispatch(logoutUser());
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [user?.id, showIdleWarning, dispatch]);

  const staySignedIn = async () => {
    if (!user || confirmBusy) return;
    setConfirmBusy(true); setConfirmError('');
    try {
      await authService.verifySession({ loginId: confirmLoginId, password: confirmPassword });
      setShowIdleWarning(false); setSecondsLeft(180); setConfirmPassword(''); setLastActivity(Date.now());
    } catch (e) { setConfirmError(e instanceof Error ? e.message : 'Credential verification failed.'); }
    finally { setConfirmBusy(false); }
  };

  // Once someone is signed in, make sure their bank's look is loaded (also after a page refresh).
  useEffect(() => {
    if (!user) return;
    if (user.role === ROLES.SUPER_ADMIN || !user.bankCode) {
      void dispatch(loadPlatformTheme());
    } else {
      void dispatch(loadBankTheme(user.bankCode));
    }
  }, [user, dispatch]);

  // Avoid a flash of the wrong colours: wait for the bank theme before showing the portal.
  const isPlatformUser = !!user && (user.role === ROLES.SUPER_ADMIN || !user.bankCode);
  const themeReady =
    !user ||
    themeState.status === 'failed' ||
    (isPlatformUser && themeState.status === 'succeeded' && themeState.bankCode === 'allianza') ||
    (!!user && !isPlatformUser && themeState.status === 'succeeded' && themeState.bankCode === user.bankCode);

  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return <BankThemeProvider>
    {themeReady ? <AppRoutes /> : <FullPageLoader />}
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
