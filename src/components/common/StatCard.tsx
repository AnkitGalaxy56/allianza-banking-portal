import { Box, Paper, Typography } from '@mui/material';
import type { StatCardData } from '@/types/dashboard';
import { STAT_ICONS } from './statIcons';

const TONE_COLOR = {
  success: 'success.dark',
  warning: 'warning.dark',
  neutral: 'text.secondary',
} as const;

export default function StatCard({ data }: { data: StatCardData }) {
  const Icon = STAT_ICONS[data.icon];
  return (
    <Paper variant="outlined" className="app-stat-card" sx={{ p: 2.5, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          {data.label}
        </Typography>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'primary.light',
            color: 'primary.main',
            flexShrink: 0,
          }}
        >
          <Icon fontSize="small" />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ mt: 1, mb: 0.5 }}>
        {data.value}
      </Typography>
      {data.helper && (
        <Typography variant="body2" fontWeight={600} sx={{ color: TONE_COLOR[data.helperTone ?? 'neutral'] }}>
          {data.helper}
        </Typography>
      )}
    </Paper>
  );
}
