import { useEffect } from 'react';
import FullPageLoader from '@/components/common/FullPageLoader';
import { ROLES } from '@/config/roles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { loadBankTheme, setPlatformTheme } from '@/redux/slices/themeSlice';
import AppRoutes from '@/routes/AppRoutes';
import BankThemeProvider from '@/theme/BankThemeProvider';

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const themeState = useAppSelector((state) => state.theme);

  // Once someone is signed in, make sure their bank's look is loaded (also after a page refresh).
  useEffect(() => {
    if (!user) return;
    if (user.role === ROLES.SUPER_ADMIN || !user.bankCode) {
      dispatch(setPlatformTheme());
    } else {
      void dispatch(loadBankTheme(user.bankCode));
    }
  }, [user, dispatch]);

  // Avoid a flash of the wrong colours: wait for the bank theme before showing the portal.
  const themeReady =
    !user ||
    user.role === ROLES.SUPER_ADMIN ||
    !user.bankCode ||
    themeState.status === 'failed' ||
    (themeState.status === 'succeeded' && themeState.bankCode === user.bankCode);

  return <BankThemeProvider>{themeReady ? <AppRoutes /> : <FullPageLoader />}</BankThemeProvider>;
}
