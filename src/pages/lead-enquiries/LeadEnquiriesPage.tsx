import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Grid, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { leadEnquiriesDemo } from './data/leadEnquiriesDemo';
import type { LeadEnquiry } from './types/leadEnquiry';
import type { LeadEnquiryUpdateValues } from './schemas/leadEnquirySchema';
import LeadEnquiryDetailsForm from './components/LeadEnquiryDetailsForm';

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const products = ['All products', 'Personal loan', 'Vehicle loan', 'Home loan'];
const statuses = ['All status', 'new', 'contacted', 'closed'];
export default function LeadEnquiriesPage() {
  const [rows, setRows] = useState(leadEnquiriesDemo);
  const [product, setProduct] = useState('All products');
  const [status, setStatus] = useState('All status');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<LeadEnquiry | null>(null);
  const [pending, setPending] = useState<LeadEnquiryUpdateValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const filtered = useMemo(() => rows.filter(r => (product === 'All products' || r.product === product) && (status === 'All status' || r.status === status) && (`${r.id} ${r.customer}`.toLowerCase().includes(search.toLowerCase()))), [rows, product, status, search]);
  const confirmSave = async () => {
    if (!selected || !pending) return;
    setSaving(true); setError('');
    try {
      // Demo state only. Replace this block with leadEnquiryService.update() when the API contract is available.
      const updated = { ...selected, status: pending.status, internalNote: pending.internalNote };
      setRows(old => old.map(row => row.id === updated.id ? updated : row));
      setSelected(updated); setFeedback(`${updated.id} updated successfully.`); setPending(null);
    } catch { setError('Unable to update this enquiry. Please try again.'); }
    finally { setSaving(false); }
  };
  const stats = [['Enquiries this week', String(rows.length === 8 ? 54 : rows.length)], ['New', String(rows.filter(r => r.status === 'new').length)], ['Contacted', String(rows.filter(r => r.status === 'contacted').length)], ['Closed', String(rows.filter(r => r.status === 'closed').length)]];
  return <Box>
    <PageHeader title="Lead Enquiries" subtitle="Loan enquiries customers submit from the app. An enquiry is not a loan approval." />
    <Grid container spacing={2} sx={{ mb: 2.5 }}>{stats.map(([label,value]) => <Grid item xs={6} md={3} key={label}><Paper variant="outlined" sx={{ borderRadius: 3, p: 2.25 }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" fontWeight={800} mt={0.5}>{value}</Typography></Paper></Grid>)}</Grid>
    {feedback && <Alert severity="success" onClose={() => setFeedback('')} sx={{ mb: 2 }}>{feedback}</Alert>}
    <Grid container spacing={2.5} alignItems="flex-start">
      <Grid item xs={12} lg={selected ? 7.1 : 12}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} sx={{ p: 2 }}>
            <TextField size="small" fullWidth placeholder="Search by lead ID or customer number" value={search} onChange={e => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
            <TextField select size="small" label="Product" value={product} onChange={e => setProduct(e.target.value)} sx={{ minWidth: 155 }}>{products.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>
            <TextField select size="small" label="Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ minWidth: 140 }}>{statuses.map(v => <MenuItem key={v} value={v}>{v === 'All status' ? v : v[0].toUpperCase()+v.slice(1)}</MenuItem>)}</TextField>
          </Stack>
          <TableContainer sx={{ maxHeight: 470 }}><Table stickyHeader size="small"><TableHead><TableRow>{['Lead','Customer','Product','Amount','Tenure','Branch','Status','Actions'].map(h => <TableCell key={h} sx={{ fontSize: 11, fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' }}>{h}</TableCell>)}</TableRow></TableHead><TableBody>{filtered.map(r => <TableRow key={r.id} hover selected={selected?.id === r.id} sx={{ '&.Mui-selected': { bgcolor: 'action.selected' } }}><TableCell sx={{ fontWeight: 750, whiteSpace: 'nowrap' }}>{r.id}</TableCell><TableCell>{r.customer}</TableCell><TableCell>{r.product}</TableCell><TableCell sx={{ whiteSpace: 'nowrap' }}>{money(r.amount)}</TableCell><TableCell>{r.tenureMonths} months</TableCell><TableCell>{r.branch}</TableCell><TableCell><StatusChip status={r.status} /></TableCell><TableCell><Button size="small" onClick={() => { setSelected(r); setError(''); }}>View</Button></TableCell></TableRow>)}{filtered.length === 0 && <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>No enquiries match these filters.</TableCell></TableRow>}</TableBody></Table></TableContainer>
          <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}><Typography variant="caption" color="text.secondary">Showing {filtered.length} of {rows.length} enquiries</Typography><Stack direction="row" spacing={1}><Button size="small" variant="outlined" disabled>Previous</Button><Button size="small" variant="outlined" disabled>Next</Button></Stack></Stack>
        </Paper>
      </Grid>
      {selected && <Grid item xs={12} lg={4.9}><LeadEnquiryDetailsForm lead={selected} saving={saving} error={error} onClose={() => { setSelected(null); setError(''); }} onSave={setPending} /></Grid>}
    </Grid>
    <ConfirmDialog open={!!pending} title="Confirm lead update" message={`Save the follow-up changes for ${selected?.id ?? 'this enquiry'}?`} confirmText="Confirm update" variant="warning" loading={saving} onCancel={() => setPending(null)} onConfirm={confirmSave} />
  </Box>;
}
