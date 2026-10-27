import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Grid, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { serviceRequestsDemo } from './data/serviceRequestsDemo';
import type { ServiceRequest } from './types/serviceRequest';
import type { ServiceRequestUpdateValues } from './schemas/serviceRequestSchema';
import ServiceRequestDetailsForm from './components/ServiceRequestDetailsForm';

const categories = ['All requests', 'KYC documents', 'Cheque book', 'Debit card', 'Change mail ID', 'Nomination'];
const branches = ['All branches', 'Main branch', 'Branch 2', 'Branch 3', 'Branch 4', 'Branch 5', 'Branch 7'];
export default function ServiceRequestsPage() {
  const [rows, setRows] = useState(serviceRequestsDemo);
  const [category, setCategory] = useState('All requests');
  const [branch, setBranch] = useState('All branches');
  const [status, setStatus] = useState('All status');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [pending, setPending] = useState<ServiceRequestUpdateValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const filtered = useMemo(() => rows.filter(r => (category === 'All requests' || r.type === category) && (branch === 'All branches' || r.branch === branch) && (status === 'All status' || r.status === status) && (`${r.id} ${r.customer}`.toLowerCase().includes(search.toLowerCase()))), [rows, category, branch, status, search]);
  const save = (values: ServiceRequestUpdateValues) => { setPending(values); };
  const confirmSave = async () => {
    if (!selected || !pending) return;
    setSaving(true); setError('');
    try {
      // Demo state only. Replace this block with serviceRequestService.update() when the API contract is available.
      const updated = { ...selected, status: pending.status, note: pending.note };
      setRows(old => old.map(row => row.id === updated.id ? updated : row));
      setSelected(updated); setFeedback(`${updated.id} updated successfully.`); setPending(null);
    } catch { setError('Unable to update this request. Please try again.'); }
    finally { setSaving(false); }
  };
  return <Box>
    <PageHeader title="Service Requests" subtitle="Review requests your customers submit from the mobile app" />
    <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2.5 }}>{categories.map(item => <Chip key={item} label={item} clickable onClick={() => setCategory(item)} color={category === item ? 'primary' : 'default'} variant={category === item ? 'filled' : 'outlined'} sx={{ height: 40, px: 0.5, fontWeight: 700 }} />)}</Stack>
    {feedback && <Alert severity="success" onClose={() => setFeedback('')} sx={{ mb: 2 }}>{feedback}</Alert>}
    <Grid container spacing={2.5} alignItems="flex-start">
      <Grid item xs={12} lg={selected ? 7 : 12}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} sx={{ p: 2 }}>
            <TextField size="small" fullWidth placeholder="Search by request ID or customer number" value={search} onChange={e => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
            <TextField select size="small" label="Branch" value={branch} onChange={e => setBranch(e.target.value)} sx={{ minWidth: 155 }}>{branches.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>
            <TextField select size="small" label="Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ minWidth: 140 }}>{[['All status','All status'],['new','New'],['in_review','In review'],['completed','Completed'],['rejected','Rejected']].map(([v,l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}</TextField>
          </Stack>
          <TableContainer sx={{ maxHeight: 470 }}><Table stickyHeader size="small"><TableHead><TableRow>{['Request','Customer','Type','Branch','Submitted','Status','Actions'].map(h => <TableCell key={h} sx={{ fontSize: 11, fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' }}>{h}</TableCell>)}</TableRow></TableHead><TableBody>{filtered.map(r => <TableRow key={r.id} hover selected={selected?.id === r.id} sx={{ '&.Mui-selected': { bgcolor: 'action.selected' } }}><TableCell sx={{ fontWeight: 750, whiteSpace: 'nowrap' }}>{r.id}</TableCell><TableCell>{r.customer}</TableCell><TableCell>{r.type}</TableCell><TableCell>{r.branch}</TableCell><TableCell>{r.submitted}</TableCell><TableCell><StatusChip status={r.status} /></TableCell><TableCell><Button size="small" onClick={() => { setSelected(r); setError(''); }}>View</Button></TableCell></TableRow>)}{filtered.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>No requests match these filters.</TableCell></TableRow>}</TableBody></Table></TableContainer>
          <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}><Typography variant="caption" color="text.secondary">Showing {filtered.length} of {rows.length} requests</Typography><Stack direction="row" spacing={1}><Button size="small" variant="outlined" disabled>Previous</Button><Button size="small" variant="outlined" disabled>Next</Button></Stack></Stack>
        </Paper>
      </Grid>
      {selected && <Grid item xs={12} lg={5}><ServiceRequestDetailsForm request={selected} saving={saving} error={error} onClose={() => { setSelected(null); setError(''); }} onSave={save} /></Grid>}
    </Grid>
    <ConfirmDialog open={!!pending} title="Confirm request update" message={`Update ${selected?.id ?? 'this request'} to the selected status?`} confirmText="Confirm update" variant="warning" loading={saving} onCancel={() => setPending(null)} onConfirm={confirmSave} />
  </Box>;
}
