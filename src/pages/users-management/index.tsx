import { ROLES } from '@/config/roles';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import AllianzaUsersPage from './allianza';
import BankUsersPage from './bank';


// import BranchUsersPage from './BranchUsersPage';
// import SuperAdminDashboard from './SuperAdminDashboard';

/** One route (/dashboard), a different dashboard per role. */
// export default function userManagement() {
//   const user = useAppSelector(selectUser);
//   if (user?.role === ROLES.SUPER_ADMIN) return <BranchUsersPage />;
//   return <BranchUsersPage />;
// }



/** One User Management route with a role-specific page entry point. */
export default function userManagement() {
  const user = useAppSelector(selectUser);

  if (user?.role === ROLES.SUPER_ADMIN) {
    return <AllianzaUsersPage />;
  }

  return <BankUsersPage />;
}
