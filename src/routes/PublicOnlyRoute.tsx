import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import { PATHS } from './paths';

/** The login page: signed-in people are redirected to where they were going (or the dashboard). */
export default function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    return <Navigate to={from ?? PATHS.dashboard} replace />;
  }
  return <Outlet />;
}
