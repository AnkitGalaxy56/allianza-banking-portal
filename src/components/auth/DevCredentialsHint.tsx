import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { env } from '@/config/env';
import type { PortalType } from '@/types/auth';
import type { DevCredential } from '@/services/mock/mockUsers';

interface Props {
  portalType: PortalType;
  bankCode: string | null;
  onUse: (credential: DevCredential) => void;
}

/** Temporary development logins (mock mode only), filtered by portal URL. */
export default function DevCredentialsHint({ portalType, bankCode, onUse }: Props) {
  const [credentials, setCredentials] = useState<DevCredential[]>([]);

  useEffect(() => {
    if (!env.useMockApi) return;
    void import('@/services/mock/mockUsers').then((m) => {
      setCredentials(m.getDevCredentials(portalType, bankCode));
    });
  }, [portalType, bankCode]);

  if (credentials.length === 0) return null;

  return (
    <Box sx={{ mt: 3, p: 1.5, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        DEVELOPMENT LOGINS (mock mode)
      </Typography>
      {credentials.map((c) => (
        <Box key={c.loginId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {c.loginId} / {c.password}
          </Typography>
          <Button size="small" onClick={() => onUse(c)} sx={{ minWidth: 0, fontSize: 12 }}>
            Use
          </Button>
        </Box>
      ))}
    </Box>
  );
}
