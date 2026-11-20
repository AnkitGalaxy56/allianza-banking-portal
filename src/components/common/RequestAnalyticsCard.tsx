import { alpha, Box, Chip, LinearProgress, Paper, Typography } from '@mui/material';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import type { BranchRequestAnalytics } from '@/types/dashboard';

export default function RequestAnalyticsCard({
  items,
  title = 'Requests by branch',
}: {
  items: BranchRequestAnalytics[];
  title?: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.total));

  return (
    <Paper variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.25 }}>
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">Branch-wise volume with request-type segregation</Typography>
        </Box>
        <Box sx={{ width: 42, height: 42, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
          <AccountTreeOutlinedIcon />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {items.map((item) => (
          <Box key={item.branch} sx={{ p: 1.75, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={700} noWrap>{item.branch}</Typography>
                <Typography variant="caption" color="text.secondary">{item.pending} pending</Typography>
              </Box>
              <Typography variant="h6" fontWeight={800}>{item.total}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(item.total / max) * 100}
              sx={(theme) => ({ height: 7, borderRadius: 5, bgcolor: alpha(theme.palette.primary.main, 0.09), '& .MuiLinearProgress-bar': { borderRadius: 5 } })}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
              {item.types.map((type) => (
                <Chip key={type.label} size="small" label={`${type.label} ${type.count}`} sx={{ fontWeight: 600, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06) }} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
