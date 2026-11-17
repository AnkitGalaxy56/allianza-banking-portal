import { useEffect, useState, type ReactNode } from 'react';
import type { Role } from '@/config/roles';
import ForbiddenPage from '@/pages/errors/ForbiddenPage';
import FullPageLoader from '@/components/common/FullPageLoader';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { settingsService } from '@/services/settings.service';

/** Enforces the signed-in role's persisted screen permissions as well as base portal roles. */
export default function RoleGuard({ allowed, screenName, children }: { allowed: Role[]; screenName: string; children: ReactNode }) {
  const user = useAppSelector(selectUser);
  const [access, setAccess] = useState<'loading' | 'allowed' | 'denied'>('loading');
  useEffect(() => {
    let active = true;
    if (!user || !allowed.includes(user.role)) { setAccess('denied'); return () => { active = false; }; }
    settingsService.getMyAccess().then(result => {
      if (!active) return;
      if (!result.configured) { setAccess('allowed'); return; }
      const permission = result.permissions.find(item => item.module === screenName);
      setAccess(permission?.actions.includes('view') ? 'allowed' : 'denied');
    }).catch(() => { if (active) setAccess('denied'); });
    return () => { active = false; };
  }, [user, allowed, screenName]);
  if (access === 'loading') return <FullPageLoader />;
  if (access === 'denied') return <ForbiddenPage />;
  return <>{children}</>;
}
