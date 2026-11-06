import { useEffect } from 'react';
import FullPageLoader from '@/components/common/FullPageLoader';
import { ROLES } from '@/config/roles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/authSlice';
import { loadBankTheme, loadPlatformTheme } from '@/redux/slices/themeSlice';
import AppRoutes from '@/routes/AppRoutes';
import BankThemeProvider from '@/theme/BankThemeProvider';

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const themeState = useAppSelector((state) => state.theme);

  // Enforce the user's configured idle timeout (fallback: 15 minutes).
  useEffect(() => {
    if (!user) return;
    const timeoutMs = Math.max(1, user.idleTimeoutMinutes ?? 15) * 60 * 1000;
    let timer: number;
    const expire = () => { void dispatch(logoutUser()); };
    const reset = () => { window.clearTimeout(timer); timer = window.setTimeout(expire, timeoutMs); };
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'mousemove', 'touchstart', 'scroll'];
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    reset();
    return () => { window.clearTimeout(timer); events.forEach((event) => window.removeEventListener(event, reset)); };
  }, [user?.id, user?.idleTimeoutMinutes, dispatch]);

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

  return <BankThemeProvider>{themeReady ? <AppRoutes /> : <FullPageLoader />}</BankThemeProvider>;
}
