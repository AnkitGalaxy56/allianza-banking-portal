import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import type { RequestModuleConfig, RequestRecord, RequestStatus } from './types';
import { validateRequestForm } from './schema';

export default function RequestHandlingPage({ config }: { config: RequestModuleConfig }) {
 const [records, setRecords] = useState<RequestRecord[]>(config.initialRecords);
 const [search, setSearch] = useState('');
 const [tab, setTab] = useState<'view' | 'pending'>('view');
 const [selected, setSelected] = useState<RequestRecord | null>(null);
 const [formOpen, setFormOpen] = useState(false);
 const [confirmOpen, setConfirmOpen] = useState(false);
 const [editing, setEditing] = useState<RequestRecord | null>(null);
 const [fields, setFields] = useState<Record<string, string>>({});
 const [feedback, setFeedback] = useState('');
 const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
 const filtered = useMemo(() => records.filter((r) => `${r.id} ${r.status} ${r.submittedOn} ${Object.values(r.fields).join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (tab === 'view' || r.status === 'Pending')), [records, search, tab]);
 const startCreate = () => { setEditing(null); setFields(Object.fromEntries(config.detailFields.map((f) => [f.key, '']))); setFieldErrors({}); setFeedback(''); setFormOpen(true); };
 const startEdit = (r: RequestRecord) => { if (r.status !== 'Authorised') return; setEditing(r); setFields({ ...r.fields }); setFieldErrors({}); setFeedback(''); setSelected(null); setFormOpen(true); };
 const save = () => { const required = config.detailFields.slice(0, 2).map((f) => f.key); const errors = validateRequestForm(fields, required); setFieldErrors(errors); if (Object.keys(errors).length) { setFeedback('Please correct the highlighted fields before submitting.'); return; } setFeedback(''); setConfirmOpen(true); };
 const commit = () => { if (editing) { setRecords((old) => old.map((r) => r.id === editing.id ? { ...r, fields: { ...fields } } : r)); setFeedback('Request updated successfully.'); } else { setRecords((old) => [{ id: `REQ-${Date.now().toString().slice(-6)}`, status: 'Pending', submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), fields: { ...fields } }, ...old]); setFeedback('Request created and sent for authorisation.'); } setConfirmOpen(false); setFormOpen(false); setEditing(null); };
 const decide = (status: RequestStatus) => { if (!selected) return; setRecords((old) => old.map((r) => r.id === selected.id ? { ...r, status } : r)); setFeedback(`${selected.id} ${status === 'Authorised' ? 'verified' : 'rejected'} successfully.`); setSelected(null); };
 const columns: DataTableColumn<RequestRecord>[] = [
  { key: 'id', label: 'Request ID', minWidth: 50, nowrap: true, render: (r) => <Typography fontWeight={700} fontSize={13}>{r.id}</Typography> },
  ...config.columns.map((column) => ({ key: column.key, label: column.label, minWidth: 25, render: (r: RequestRecord) => r.fields[column.key] || '—' })),
  { key: 'status', label: 'Status', minWidth: 25, nowrap: true, render: (r) => <Chip size="small" variant="outlined" color={r.status === 'Pending' ? 'warning' : r.status === 'Authorised' ? 'success' : 'error'} label={r.status === 'Pending' ? 'Pending for Authorisation' : r.status} /> },
  { key: 'actions', label: 'Actions', minWidth: 220, nowrap: true, render: (r) => r.status === 'Pending' ? <Button size="small" color="success" variant="contained" onClick={() => setSelected(r)}>Verify</Button> : <Stack direction="row" spacing={0.25}><Button size="small" disabled={r.status !== 'Authorised'} onClick={() => setSelected(r)}>View</Button><Button size="small" disabled={r.status !== 'Authorised'} onClick={() => startEdit(r)}>Edit</Button></Stack> },
 ];
 return <Box>
  <PageHeader title={config.title} subtitle={config.description} />
  {feedback && <Alert sx={{ mb: 2 }} severity={feedback.startsWith('Please') ? 'warning' : 'success'} onClose={() => setFeedback('')}>{feedback}</Alert>}
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
   <Box sx={{ p: 2.5 }}>
    <TextField size="small" fullWidth placeholder={config.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }}>
     <Button size="small" variant={tab === 'view' ? 'contained' : 'outlined'} onClick={() => setTab('view')}>View</Button>
     <Button size="small" variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Pending for Authorisation ({records.filter((r) => r.status === 'Pending').length})</Button>
     <Box sx={{ flex: 1 }} />
     {!config.hideCreateButton && <Button size="small" variant="contained" onClick={startCreate}>Create</Button>}
    </Stack>
   </Box>
   <DataTable rows={filtered} columns={columns} getRowId={(r) => r.id} emptyMessage="No requests found." />
   <Stack direction="row" justifyContent="space-between" sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}><Typography variant="body2" color="text.secondary">Showing {filtered.length} of {records.length} requests</Typography><Typography variant="body2" color="text.secondary">Pending: {records.filter((r) => r.status === 'Pending').length}</Typography></Stack>
  </Paper>
  <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
   <DialogTitle sx={{ fontWeight: 800 }}>{selected?.status === 'Pending' ? 'Verify Request' : 'View Request'} {selected?.id}</DialogTitle>
   <DialogContent dividers>{selected && <><Alert severity={selected.status === 'Pending' ? 'warning' : 'success'} sx={{ mb: 2 }}>Status: {selected.status === 'Pending' ? 'Pending for Authorisation' : selected.status}</Alert><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>{config.detailFields.map((f) => <Box key={f.key}><Typography variant="caption" color="text.secondary">{f.label}</Typography><Typography>{selected.fields[f.key] || '—'}</Typography></Box>)}</Box><Divider sx={{ my: 2 }} /></>}</DialogContent>
   <DialogActions><Button size="small" onClick={() => setSelected(null)}>Close</Button>{selected?.status === 'Pending' && <><Button size="small" color="error" onClick={() => decide('Rejected')}>Reject</Button><Button size="small" color="success" variant="contained" onClick={() => decide('Authorised')}>Verify</Button></>}</DialogActions>
  </Dialog>
  <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="lg" PaperProps={{ sx: { width: '100%', maxWidth: 1100, minHeight: { xs: 'auto', md: 520 } } }}>
   <DialogTitle sx={{ fontWeight: 800 }}>{config.title.includes('RTGS / NEFT / IMPS') ? (editing ? 'Edit Payment Request' : 'Create Payment Request') : `${editing ? 'Edit' : 'Create'} ${config.title.replace(/ Requests?$/, '')} Request`}</DialogTitle>
   <DialogContent dividers><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2, pt: 1 }}>{config.detailFields.map((f, index) => <TextField key={f.key} select={Boolean(f.options)} size="small" label={f.label} required={index < 2} error={Boolean(fieldErrors[f.key])} helperText={fieldErrors[f.key] || ' '} value={fields[f.key] ?? ''} onChange={(e) => { setFields((old) => ({ ...old, [f.key]: e.target.value })); setFieldErrors((old) => ({ ...old, [f.key]: '' })); }} multiline={['remarks', 'reason'].includes(f.key)} minRows={['remarks', 'reason'].includes(f.key) ? 2 : 1}>{f.options?.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</TextField>)}</Box></DialogContent>
   <DialogActions sx={{ p: 2 }}><Button size="small" onClick={() => setFormOpen(false)}>Cancel</Button><Button size="small" variant="contained" onClick={save}>Submit</Button></DialogActions>
  </Dialog>
  <ConfirmDialog open={confirmOpen} title="Confirm Request" message={`Confirm ${editing ? 'updating' : 'creating'} this request?`} onCancel={() => setConfirmOpen(false)} onConfirm={commit} />
 </Box>;
}
