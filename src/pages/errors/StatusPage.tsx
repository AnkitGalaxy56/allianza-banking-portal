import type { ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

interface Props {
  title: string;
  message: string;
  icon?: ReactNode;
}

export default function StatusPage({ title, message, icon }: Props) {
  return (
    <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}>
      <Box sx={{ maxWidth: 420 }}>
        {icon && <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>}
        <Typography variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Button component={RouterLink} to={PATHS.dashboard} variant="contained">
          Back to dashboard
        </Button>
      </Box>
    </Box>
  );
}
