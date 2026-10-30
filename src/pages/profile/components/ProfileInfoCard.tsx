import type { ReactNode } from 'react';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';

interface ProfileInfoCardProps {
  title: string;
  icon: ReactNode;
  fields: Array<{ label: string; value: string }>;
}

export default function ProfileInfoCard({ title, icon, fields }: ProfileInfoCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.25, height: '100%', borderColor: 'divider', borderRadius: 2.5 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
        <Box sx={{ display: 'flex', color: 'primary.main', '& svg': { fontSize: 23 } }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight={800}>{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 0.5 }} />
      <Stack divider={<Divider flexItem />}>
        {fields.map((field) => (
          <Stack key={field.label} direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ py: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 44%', minWidth: 0 }}>{field.label}</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ textAlign: 'right', overflowWrap: 'anywhere', minWidth: 0 }}>{field.value || 'Not added'}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
