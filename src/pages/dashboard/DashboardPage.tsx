import { ROLES } from '@/config/roles';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import BankDashboard from './BankDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

/** One route (/dashboard), a different dashboard per role. */
export default function DashboardPage() {
  const user = useAppSelector(selectUser);
  if (user?.role === ROLES.SUPER_ADMIN) return <SuperAdminDashboard />;
  return <BankDashboard />;
}
