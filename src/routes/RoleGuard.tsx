import type { ReactNode } from 'react';
import type { Role } from '@/config/roles';
import ForbiddenPage from '@/pages/errors/ForbiddenPage';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';

/** Shows a "no access" page when the signed-in role is not allowed to open this route. */
export default function RoleGuard({ allowed, children }: { allowed: Role[]; children: ReactNode }) {
  const user = useAppSelector(selectUser);
  if (!user || !allowed.includes(user.role)) {
    return <ForbiddenPage />;
  }
  return <>{children}</>;
}
