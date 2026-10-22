import { Box, ButtonBase, Paper, Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

export interface QuickAction {
  label: string;
  to: string;
  icon: SvgIconComponent;
}

export default function QuickActionsCard({ actions }: { actions: QuickAction[] }) {
  return (
    <Paper variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Quick actions
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.25 }}>
        {actions.map(({ label, to, icon: Icon }) => (
          <ButtonBase
            key={label}
            component={RouterLink}
            to={to}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 1.5,
              p: 1.25,
              width: '100%',
              textAlign: 'left',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': { bgcolor: 'primary.light' },
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.light',
                color: 'primary.main',
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Typography variant="body2" fontWeight={700}>
              {label}
            </Typography>
          </ButtonBase>
        ))}
      </Box>
    </Paper>
  );
}
