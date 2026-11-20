import { useAsyncData } from '@/hooks/useAsyncData';
import { requestHandlingService } from '@/services/request-handling.service';
import { Box, Paper, Typography } from '@mui/material';
import FullPageLoader from './FullPageLoader';
import ErrorState from './ErrorState';

export default function RequestHandlingCounts() {
  const { data, loading, error, reload } = useAsyncData(() => requestHandlingService.counts(), []);
  if (!data && loading) return <FullPageLoader />;
  if (!data) return <ErrorState message={error ?? 'Unable to load request counts'} onRetry={reload} />;
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)' }, gap: 2, mb: 3, opacity: loading ? .6 : 1 }}>
    {[['All Requests', data.total], ['Pending Requests', data.pending]].map(([label, value]) => <Paper key={String(label)} variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" fontWeight={800}>{Number(value).toLocaleString()}</Typography>
    </Paper>)}
  </Box>;
}
