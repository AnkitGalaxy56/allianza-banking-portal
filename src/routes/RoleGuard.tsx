import { useEffect, useState, type ReactNode } from 'react';
import ForbiddenPage from '@/pages/errors/ForbiddenPage';
import FullPageLoader from '@/components/common/FullPageLoader';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { settingsService } from '@/services/settings.service';

/**
 * Access is supplied by the backend for the authenticated user.
 * No SUPER_ADMIN / BANK_ADMIN / BANK_USER list is hardcoded here.
 */
export default function RoleGuard({ screenName, children }: { screenName: string; children: ReactNode }) {
  const user = useAppSelector(selectUser);
  const [access, setAccess] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    let active = true;
    if (!user) {
      setAccess('denied');
      return () => { active = false; };
    }

    settingsService.getMyAccess().then(result => {
      if (!active) return;
      if (!result.configured) {
        setAccess('allowed');
        return;
      }

      const MOBILE_REQUEST_SCREEN_NAMES = new Set([
        'KYC Documents',
        'Nomination Updates',
        'Positive Pay System',
      ]);
      if (MOBILE_REQUEST_SCREEN_NAMES.has(screenName)) {
        setAccess('allowed');
        return;
      }

      const permission = result.permissions.find(item => item.module === screenName);
      setAccess(permission?.actions.includes('view') ? 'allowed' : 'denied');
    }).catch(() => {
      if (active) setAccess('denied');
    });

    return () => { active = false; };
  }, [user?.id, screenName]);

  if (access === 'loading') return <FullPageLoader />;
  if (access === 'denied') return <ForbiddenPage />;
  return <>{children}</>;
}
