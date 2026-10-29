import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, InputAdornment, MenuItem, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import type { ValidationModuleConfig, ValidationRecord, RequestDecision } from './types';

interface Props { config: ValidationModuleConfig }
const statusColor = (status: RequestDecision): 'warning' | 'success' | 'error' =>
  status === 'Pending' ? 'warning' : status === 'Authorised' ? 'success' : 'error';

export default function RequestQueuePage({ config }: Props) {
  const [records, setRecords] = useState<ValidationRecord[]>(config.initialRecords);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<ValidationRecord | null>(null);
  const [feedback, setFeedback] = useState('');

  const filtered = useMemo(() => records.filter((record) => {
    const text = [record.id, record.status, record.submittedOn, ...Object.values(record.fields)].join(' ').toLowerCase();
    return text.includes(search.toLowerCase()) && (statusFilter === 'All' || record.status === statusFilter);
  }), [records, search, statusFilter]);

  const decide = (decision: 'Authorised' | 'Rejected') => {
    if (!selected) return;
    setRecords((current) => current.map((record) => record.id === selected.id ? { ...record, status: decision } : record));
    setFeedback(`${selected.id} ${decision.toLowerCase()} successfully.`);
    setSelected(null);
  };

  return <Box>
    <PageHeader title={config.title} subtitle={config.description} />
    {feedback && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFeedback('')}>{feedback}</Alert>}
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2 }}>
        <TextField size="small" fullWidth placeholder={config.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
        <TextField select size="small" label="Request status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} sx={{ minWidth: 180 }}>
          {['All', 'Pending', 'Authorised', 'Rejected'].map((status) => <MenuItem key={status} value={status}>{status === 'All' ? 'All statuses' : status}</MenuItem>)}
        </TextField>
      </Stack>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size="small">
          <TableHead><TableRow>
            <TableCell sx={{ fontWeight: 800, fontSize: 11, whiteSpace: 'nowrap' }}>REQUEST ID</TableCell>
            {config.columns.map((column) => <TableCell key={column.key} sx={{ fontWeight: 800, fontSize: 11, whiteSpace: 'nowrap' }}>{column.label.toUpperCase()}</TableCell>)}
            <TableCell sx={{ fontWeight: 800, fontSize: 11, whiteSpace: 'nowrap' }}>SUBMITTED ON</TableCell>
            <TableCell sx={{ fontWeight: 800, fontSize: 11 }}>STATUS</TableCell>
            <TableCell sx={{ fontWeight: 800, fontSize: 11 }}>ACTION</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {filtered.map((record) => <TableRow key={record.id} hover>
              <TableCell sx={{ fontWeight: 750, whiteSpace: 'nowrap' }}>{record.id}</TableCell>
              {config.columns.map((column) => <TableCell key={column.key} sx={{ whiteSpace: 'nowrap' }}>{record.fields[column.key] || '—'}</TableCell>)}
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{record.submittedOn}</TableCell>
              <TableCell><Chip size="small" label={record.status} color={statusColor(record.status)} variant="outlined" /></TableCell>
              <TableCell><Button size="small" variant={record.status === 'Pending' ? 'contained' : 'outlined'} onClick={() => setSelected(record)}>{record.status === 'Pending' ? 'Review' : 'View'}</Button></TableCell>
            </TableRow>)}
            {!filtered.length && <TableRow><TableCell colSpan={config.columns.length + 4} align="center" sx={{ py: 5, color: 'text.secondary' }}>No requests match your filters.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">Showing {filtered.length} of {records.length} requests</Typography>
        <Typography variant="caption" color="text.secondary">Pending: {records.filter((record) => record.status === 'Pending').length}</Typography>
      </Stack>
    </Paper>

    <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>Review Request {selected?.id}</DialogTitle>
      <DialogContent dividers>
        {selected && <>
          <Alert severity={selected.status === 'Pending' ? 'info' : 'success'} sx={{ mb: 2 }}>Current status: {selected.status}</Alert>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box><Typography variant="caption" color="text.secondary">Request ID</Typography><Typography fontWeight={700}>{selected.id}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">Submitted on</Typography><Typography fontWeight={700}>{selected.submittedOn}</Typography></Box>
            {config.detailFields.map((field) => <Box key={field.key}><Typography variant="caption" color="text.secondary">{field.label}</Typography><Typography fontWeight={650} sx={{ overflowWrap: 'anywhere' }}>{selected.fields[field.key] || '—'}</Typography></Box>)}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">Review the request details before choosing an action. This prototype updates the displayed status locally; connect the corresponding backend API to persist authorisation decisions.</Typography>
        </>}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button color="inherit" onClick={() => setSelected(null)}>Close</Button>
        {selected?.status === 'Pending' && <>
          <Button color="error" variant="outlined" onClick={() => decide('Rejected')}>{config.rejectLabel ?? 'Reject'}</Button>
          <Button variant="contained" onClick={() => decide('Authorised')}>{config.approveLabel ?? 'Authorise'}</Button>
        </>}
      </DialogActions>
    </Dialog>
  </Box>;
}
