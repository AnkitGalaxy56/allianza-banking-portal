import { useAppSelector } from '@/redux/hooks';
import { selectPortalType } from '@/redux/slices/authSlice';
import BankDashboard from './BankDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

/**
 * Portal selection is based on the URL used for authentication:
 *   /login                  -> Allianza portal
 *   /login?bank=<bankCode>  -> Bank portal
 *
 * The user's backend role is NOT used to choose the dashboard.
 */
export default function DashboardPage() {
  const portalType = useAppSelector(selectPortalType);

  if (portalType === 'BANK') return <BankDashboard />;
  return <SuperAdminDashboard />;
}
