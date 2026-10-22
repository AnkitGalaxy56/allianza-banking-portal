import { alpha, Box, LinearProgress, Paper, Typography } from '@mui/material';
import type { BarItem } from '@/types/dashboard';

/** A card with a title and one horizontal progress bar per item (e.g. "Lead enquiries this week"). */
export default function BarListCard({ title, items }: { title: string; items: BarItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <Paper variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {items.map((item) => (
          <Box key={item.label}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="body2" fontWeight={600}>
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {item.count}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(item.count / max) * 100}
              sx={(theme) => ({
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.text.primary, 0.08),
                '& .MuiLinearProgress-bar': { borderRadius: 4 },
              })}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
