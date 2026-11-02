import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import type { ValidationModuleConfig, ValidationRecord, RequestDecision } from './types';

interface Props { config: ValidationModuleConfig }
const statusColor = (status: RequestDecision): 'warning' | 'success' | 'error' => status === 'Pending' ? 'warning' : status === 'Authorised' ? 'success' : 'error';

export default function RequestQueuePage({ config }: Props) {
  const [records, setRecords] = useState<ValidationRecord[]>(config.initialRecords);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<ValidationRecord | null>(null);
  const [editing, setEditing] = useState<ValidationRecord | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const filtered = useMemo(() => records.filter((r) => [r.id, r.status, r.submittedOn, ...Object.values(r.fields)].join(' ').toLowerCase().includes(search.toLowerCase()) && (statusFilter === 'All' || r.status === statusFilter)), [records, search, statusFilter]);
  const verify = (decision: 'Authorised' | 'Rejected') => { if (!selected) return; setRecords((current) => current.map((r) => r.id === selected.id ? { ...r, status: decision } : r)); setFeedback(`${selected.id} ${decision === 'Authorised' ? 'verified' : 'rejected'} successfully.`); setSelected(null); };
  const startEdit = (record: ValidationRecord) => { if (record.status !== 'Authorised') return; setEditing(record); setEditFields({ ...record.fields }); setSelected(null); };
  const saveEdit = () => { if (!editing) return; setRecords((current) => current.map((r) => r.id === editing.id ? { ...r, fields: { ...editFields } } : r)); setFeedback(`${editing.id} updated successfully.`); setEditing(null); };
  const columns: DataTableColumn<ValidationRecord>[] = [
    { key: 'id', label: 'Request ID', minWidth: 50, nowrap: true, render: (r) => <Typography fontWeight={750} fontSize={13}>{r.id}</Typography> },
    ...config.columns.map((c) => ({ key: c.key, label: c.label, minWidth: 25, render: (r: ValidationRecord) => r.fields[c.key] || '—' })),
    { key: 'submittedOn', label: 'Submitted On', minWidth: 25, render: (r) => r.submittedOn },
    { key: 'status', label: 'Status', minWidth: 25, nowrap: true, render: (r) => <Chip size="small" label={r.status === 'Pending' ? 'Pending for Authorisation' : r.status} color={statusColor(r.status)} variant="outlined" /> },
    { key: 'actions', label: 'Actions', minWidth: 220, nowrap: true, render: (r) => r.status === 'Pending' ? <Button size="small" color="success" variant="contained" onClick={() => setSelected(r)}>Verify</Button> : <Stack direction="row" spacing={0.25}><Button size="small" disabled={r.status !== 'Authorised'} onClick={() => setSelected(r)}>View</Button><Button size="small" disabled={r.status !== 'Authorised'} onClick={() => startEdit(r)}>Edit</Button></Stack> },
  ];
  return <Box>
    <PageHeader title={config.title} subtitle={config.description} />
    {feedback && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFeedback('')}>{feedback}</Alert>}
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2 }}>
        <TextField size="small" fullWidth placeholder={config.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
        <TextField select size="small" label="Request status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 180 }}>{['All', 'Pending', 'Authorised', 'Rejected'].map((s) => <MenuItem key={s} value={s}>{s === 'All' ? 'All statuses' : s === 'Pending' ? 'Pending for Authorisation' : s}</MenuItem>)}</TextField>
      </Stack>
      <DataTable rows={filtered} columns={columns} getRowId={(r) => r.id} emptyMessage="No requests match your filters." />
      <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}><Typography variant="caption" color="text.secondary">Showing {filtered.length} of {records.length} requests</Typography><Typography variant="caption" color="text.secondary">Pending: {records.filter((r) => r.status === 'Pending').length}</Typography></Stack>
    </Paper>
    <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>{selected?.status === 'Pending' ? 'Verify Request' : 'View Request'} {selected?.id}</DialogTitle>
      <DialogContent dividers>{selected && <><Alert severity={selected.status === 'Pending' ? 'warning' : 'success'} sx={{ mb: 2 }}>Current status: {selected.status === 'Pending' ? 'Pending for Authorisation' : selected.status}</Alert><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}><Box><Typography variant="caption" color="text.secondary">Request ID</Typography><Typography fontWeight={700}>{selected.id}</Typography></Box><Box><Typography variant="caption" color="text.secondary">Submitted on</Typography><Typography fontWeight={700}>{selected.submittedOn}</Typography></Box>{config.detailFields.map((f) => <Box key={f.key}><Typography variant="caption" color="text.secondary">{f.label}</Typography><Typography fontWeight={650} sx={{ overflowWrap: 'anywhere' }}>{selected.fields[f.key] || '—'}</Typography></Box>)}</Box><Divider sx={{ my: 2 }} /></>}</DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}><Button color="inherit" onClick={() => setSelected(null)}>Close</Button>{selected?.status === 'Pending' && <><Button color="error" variant="outlined" onClick={() => verify('Rejected')}>{config.rejectLabel ?? 'Reject'}</Button><Button color="success" variant="contained" onClick={() => verify('Authorised')}>Verify</Button></>}</DialogActions>
    </Dialog>
    <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="lg" PaperProps={{ sx: { width: '100%', maxWidth: 1100, minHeight: { xs: 'auto', md: 520 } } }}><DialogTitle sx={{ fontWeight: 800 }}>{config.title.includes('RTGS / NEFT / IMPS') ? 'Edit Payment Request' : 'Edit Request'} {editing?.id}</DialogTitle><DialogContent dividers sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2, pt: 1 }}>{config.detailFields.map((f) => <TextField key={f.key} fullWidth size="small" select={Boolean(f.options)} label={f.label} value={editFields[f.key] ?? ''} onChange={(e) => setEditFields((old) => ({ ...old, [f.key]: e.target.value }))}>{f.options?.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</TextField>)}</Box></DialogContent><DialogActions><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="contained" onClick={saveEdit}>Save Changes</Button></DialogActions></Dialog>
  </Box>;
}
