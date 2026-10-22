import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import {
  selectAuth,
  selectIsAuthenticated,
} from '@/redux/slices/authSlice';
import { PATHS } from './paths';

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { otpPending } = useAppSelector(selectAuth);
  const location = useLocation();

  if (otpPending) {
    return <Navigate to={PATHS.otp} replace />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATHS.login}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
