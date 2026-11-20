import { alpha, Box, LinearProgress, Paper, Typography } from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import type { BankRequestAnalytics } from '@/types/dashboard';

export default function BankAnalyticsCard({ items, title = 'Requests by bank' }: { items: BankRequestAnalytics[]; title?: string }) {
  const max = Math.max(1, ...items.map((item) => item.total));
  return (
    <Paper variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.25 }}>
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">Platform-level request distribution</Typography>
        </Box>
        <Box sx={{ width: 42, height: 42, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
          <AccountBalanceOutlinedIcon />
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gap: 1.75 }}>
        {items.map((item) => (
          <Box key={item.code}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 0.6 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>{item.bank}</Typography>
                <Typography variant="caption" color="text.secondary">{item.branches} branches · {item.pending} pending</Typography>
              </Box>
              <Typography variant="body2" fontWeight={800}>{item.total}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={(item.total / max) * 100} sx={(theme) => ({ height: 8, borderRadius: 5, bgcolor: alpha(theme.palette.primary.main, 0.08), '& .MuiLinearProgress-bar': { borderRadius: 5 } })} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
