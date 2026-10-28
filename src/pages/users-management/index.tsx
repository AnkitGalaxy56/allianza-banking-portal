import { ROLES } from '@/config/roles';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import BranchUsersPage from './BranchUsersPage';
// import SuperAdminDashboard from './SuperAdminDashboard';

/** One route (/dashboard), a different dashboard per role. */
export default function userManagement() {
  const user = useAppSelector(selectUser);
  if (user?.role === ROLES.SUPER_ADMIN) return <BranchUsersPage />;
  return <BranchUsersPage />;
}
