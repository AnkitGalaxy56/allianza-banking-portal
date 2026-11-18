import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import type { ValidationModuleConfig, ValidationRecord, RequestDecision } from './types';
import { getErrorMessage } from '@/services/api/apiError';
import type { RequestHandlingModule } from '@/services/request-handling.service';
import { useRequestModule } from './useRequestModule';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface Props { config: ValidationModuleConfig; module: RequestHandlingModule }
const statusColor = (status: RequestDecision): 'warning' | 'success' | 'error' => status === 'Pending' ? 'warning' : status === 'Authorised' ? 'success' : 'error';

export default function RequestQueuePage({ config, module }: Props) {
  const store = useRequestModule(module);
  const records: ValidationRecord[] = store.records;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<ValidationRecord | null>(null);
  const [decisionConfirm, setDecisionConfirm] = useState<'Authorised' | 'Rejected' | null>(null);
  const [editing, setEditing] = useState<ValidationRecord | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const filtered = useMemo(() => records.filter((r) => [r.id, r.status, r.submittedOn, ...Object.values(r.fields)].join(' ').toLowerCase().includes(search.toLowerCase()) && (statusFilter === 'All' || r.status === statusFilter)), [records, search, statusFilter]);
  const openDetail = async (r: ValidationRecord) => { try { setSelected(await store.getOne(r.id)); } catch (e) { setFeedback(getErrorMessage(e, 'Unable to load the request.')); } };
  const verify = async (decision: 'Authorised' | 'Rejected') => { if (!selected) return; const label = selected.displayId ?? selected.id; try { await store.decide(selected.id, decision, undefined); setFeedback(`${label} ${decision === 'Authorised' ? 'verified' : 'rejected'} successfully.`); } catch (e) { setFeedback(getErrorMessage(e, 'Unable to update the request.')); } setDecisionConfirm(null); setSelected(null); };
  const requestDecision = (decision: 'Authorised' | 'Rejected') => setDecisionConfirm(decision);
  // PostgreSQL is_sys BOOLEAN: true = Control Panel, false = Mobile App.
  // Also support the API's formatted source strings and legacy SMALLINT values.
  const isControlPanelRequest = (record: ValidationRecord) => {
    const source = record.fields.isSys ?? record.fields.is_sys;
    if (typeof source === 'boolean') return source;
    const normalized = String(source ?? '').trim().toLowerCase();
    return normalized === 'control panel' || normalized === 'true' || normalized === '2';
  };

  const startEdit = async (record: ValidationRecord) => {
    // Payment: only Pending requests created from Control Panel can be edited.
    if (module !== 'payments' || record.status !== 'Pending' || !isControlPanelRequest(record)) return;
    try {
      const d = await store.getOne(record.id);
      if (d.status !== 'Pending' || !isControlPanelRequest(d)) return;
      setEditing(d);
      const { isSys: _isSys, is_sys: _isSysLegacy, ...editableFields } = d.fields;
      setEditFields(Object.fromEntries(Object.entries(editableFields).map(([key, value]) => [key, String(value ?? '')])));
      setSelected(null);
    } catch (e) { setFeedback(getErrorMessage(e, 'Unable to load the request.')); }
  };
  const saveEdit = async () => { if (!editing) return; try { await store.update(editing.id, editFields); setFeedback(`${editing.displayId ?? editing.id} updated and sent for authorisation.`); setEditing(null); } catch (e) { setFeedback(getErrorMessage(e, 'Unable to save the changes.')); } };
  const columns: DataTableColumn<ValidationRecord>[] = [
    { key: 'id', label: 'Request ID', minWidth: 50, nowrap: true, render: (r) => <Typography fontWeight={750} fontSize={13}>{r.displayId ?? r.id}</Typography> },
    ...config.columns.map((c) => ({ key: c.key, label: c.label, minWidth: 25, render: (r: ValidationRecord) => r.fields[c.key] || '—' })),
    { key: 'submittedOn', label: 'Submitted On', minWidth: 25, render: (r) => r.submittedOn },
    { key: 'status', label: 'Status', minWidth: 25, nowrap: true, render: (r) => <Chip size="small" label={r.status === 'Pending' ? 'Pending for Authorisation' : r.status} color={statusColor(r.status)} variant="outlined" /> },
    { key: 'actions', label: 'Actions', minWidth: 260, nowrap: true, render: (r) => r.status === 'Pending' ? <Stack direction="row" spacing={0.25}><Button size="small" color="success" variant="contained" onClick={() => void openDetail(r)}>Verify</Button>{module === 'payments' && isControlPanelRequest(r) && <Button size="small" color="primary" variant="outlined" onClick={() => void startEdit(r)}>Edit</Button>}</Stack> : <Stack direction="row" spacing={0.25}><Button size="small" onClick={() => void openDetail(r)}>View</Button></Stack> },
  ];
  return <Box>
    <PageHeader title={config.title} subtitle={config.description} />
    {store.error && <Alert severity="error" sx={{ mb: 2 }}>{store.error}</Alert>}
    {feedback && <Alert severity={/updated|verified|rejected|sent for authorisation/.test(feedback) ? 'success' : 'warning'} sx={{ mb: 2 }} onClose={() => setFeedback('')}>{feedback}</Alert>}
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2 }}>
        <TextField size="small" fullWidth placeholder={config.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
        <TextField select size="small" label="Request status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 180 }}>{['All', 'Pending', 'Authorised', 'Rejected'].map((s) => <MenuItem key={s} value={s}>{s === 'All' ? 'All statuses' : s === 'Pending' ? 'Pending for Authorisation' : s}</MenuItem>)}</TextField>
      </Stack>
      <DataTable rows={filtered} columns={columns} getRowId={(r) => r.id} emptyMessage="No requests match your filters." />
      <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}><Typography variant="caption" color="text.secondary">Showing {filtered.length} of {records.length} requests</Typography><Typography variant="caption" color="text.secondary">Pending: {records.filter((r) => r.status === 'Pending').length}</Typography></Stack>
    </Paper>
    <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>{selected?.status === 'Pending' ? 'Verify Request' : 'View Request'} {selected?.displayId ?? selected?.id}</DialogTitle>
      <DialogContent dividers>{selected && <><Alert severity={selected.status === 'Pending' ? 'warning' : 'success'} sx={{ mb: 2 }}>Current status: {selected.status === 'Pending' ? 'Pending for Authorisation' : selected.status}</Alert><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}><Box><Typography variant="caption" color="text.secondary">Request ID</Typography><Typography fontWeight={700}>{selected.displayId ?? selected.id}</Typography></Box><Box><Typography variant="caption" color="text.secondary">Submitted on</Typography><Typography fontWeight={700}>{selected.submittedOn}</Typography></Box>{config.detailFields.map((f) => <Box key={f.key}><Typography variant="caption" color="text.secondary">{f.label}</Typography><Typography fontWeight={650} sx={{ overflowWrap: 'anywhere' }}>{selected.fields[f.key] || '—'}</Typography></Box>)}</Box><Divider sx={{ my: 2 }} /></>}</DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}><Button color="inherit" onClick={() => setSelected(null)}>Close</Button>{selected?.status === 'Pending' && <><Button color="error" variant="outlined" onClick={() => requestDecision('Rejected')}>{config.rejectLabel ?? 'Reject'}</Button><Button color="success" variant="contained" onClick={() => requestDecision('Authorised')}>Verify</Button></>}</DialogActions>
    </Dialog>
    <ConfirmDialog open={decisionConfirm !== null} title={decisionConfirm === 'Rejected' ? 'Confirm Rejection' : 'Confirm Verification'} message={decisionConfirm === 'Rejected' ? 'Are you sure you want to reject this request?' : 'Are you sure you want to verify this request?'} confirmText={decisionConfirm === 'Rejected' ? 'Reject' : 'Verify'} variant={decisionConfirm === 'Rejected' ? 'danger' : 'warning'} onCancel={() => setDecisionConfirm(null)} onConfirm={() => decisionConfirm && void verify(decisionConfirm)} />
    <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="lg" PaperProps={{ sx: { width: '100%', maxWidth: 1100, minHeight: { xs: 'auto', md: 520 } } }}><DialogTitle sx={{ fontWeight: 800 }}>{config.title.includes('RTGS / NEFT / IMPS') ? 'Edit Payment Request' : 'Edit Request'} {editing?.displayId ?? editing?.id}</DialogTitle><DialogContent dividers sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2, pt: 1 }}>{config.detailFields.map((f) => <TextField key={f.key} fullWidth size="small" select={Boolean(f.options)} label={f.label} value={editFields[f.key] ?? ''} onChange={(e) => setEditFields((old) => ({ ...old, [f.key]: e.target.value }))}>{f.options?.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</TextField>)}</Box></DialogContent><DialogActions><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="contained" onClick={saveEdit}>Save Changes</Button></DialogActions></Dialog>
  </Box>;
}
