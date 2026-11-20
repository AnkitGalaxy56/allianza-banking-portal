import { useAppSelector } from '@/redux/hooks';
import { selectPortalType } from '@/redux/slices/authSlice';
import AllianzaUsersPage from './allianza';
import BankUsersPage from './bank';

/** User-management entry point is selected by portal, not by user role. */
export default function UserManagement() {
  const portalType = useAppSelector(selectPortalType);
  return portalType === 'ALLIANZA' ? <AllianzaUsersPage /> : <BankUsersPage />;
}
