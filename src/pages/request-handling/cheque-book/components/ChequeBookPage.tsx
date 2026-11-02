import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ACCOUNT_STATUS_OPTIONS } from '@/constants/accountStatus';

type RecordItem = { id: string; requestStatus: 'Pending' | 'Authorised' | 'Rejected'; accountNumber: string; customerName: string; chequeBookType: string; deliveryMethod: string; deliveryAddress: string; primary: boolean; default: boolean; statusCode: string };
type FormData = Omit<RecordItem, 'id' | 'requestStatus'>;
const empty: FormData = { accountNumber: '', customerName: '', chequeBookType: '25 pages', deliveryMethod: 'Collect from branch', deliveryAddress: '', primary: false, default: false, statusCode: '001' };

export default function ChequeBookPage() {
 const [rows, setRows] = useState<RecordItem[]>([
  { id: 'CHQ-1001', requestStatus: 'Pending', ...empty, accountNumber: 'XXXX 4821', customerName: 'Aarav Sharma', statusCode: '002', primary: true, default: true },
  { id: 'CHQ-1002', requestStatus: 'Authorised', ...empty, accountNumber: 'XXXX 1176', customerName: 'Meera Joshi', chequeBookType: '50 pages', deliveryMethod: 'Delivery address', deliveryAddress: '12 MG Road, Pune' },
 ]);
 const [search, setSearch] = useState('');
 const [tab, setTab] = useState<'view' | 'pending'>('view');
 const [open, setOpen] = useState(false);
 const [selected, setSelected] = useState<RecordItem | null>(null);
 const [confirm, setConfirm] = useState(false);
 const [editing, setEditing] = useState<RecordItem | null>(null);
 const [form, setForm] = useState<FormData>(empty);
 const [message, setMessage] = useState('');
 const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
 const filtered = useMemo(() => rows.filter((record) => `${record.id} ${record.accountNumber} ${record.customerName}`.toLowerCase().includes(search.toLowerCase()) && (tab === 'view' || record.requestStatus === 'Pending')), [rows, search, tab]);
 const field = (key: keyof typeof empty, value: string | boolean) => setForm((old) => ({ ...old, [key]: value }));
 const startNew = () => { setEditing(null); setForm(empty); setFieldErrors({}); setOpen(true); };
 const startEdit = (record: RecordItem) => { if (record.requestStatus !== 'Authorised') return; setEditing(record); setForm({ accountNumber: record.accountNumber, customerName: record.customerName, chequeBookType: record.chequeBookType, deliveryMethod: record.deliveryMethod, deliveryAddress: record.deliveryAddress, primary: record.primary, default: record.default, statusCode: record.statusCode }); setFieldErrors({}); setOpen(true); };
 const verify = (decision: 'Authorised' | 'Rejected') => { if (!selected) return; setRows((old) => old.map((r) => r.id === selected.id ? { ...r, requestStatus: decision } : r)); setMessage(`${selected.id} ${decision === 'Authorised' ? 'verified' : 'rejected'} successfully.`); setSelected(null); };
 const save = () => { const next: Record<string, string> = {}; if (!form.accountNumber.trim()) next.accountNumber = 'Account number is required.'; else if (!/^[A-Za-z0-9 Xx-]{4,24}$/.test(form.accountNumber.trim())) next.accountNumber = 'Enter a valid account number.'; if (!form.customerName.trim()) next.customerName = 'Customer name is required.'; else if (form.customerName.trim().length < 2) next.customerName = 'Enter at least 2 characters.'; if (form.deliveryMethod === 'Delivery address' && !form.deliveryAddress.trim()) next.deliveryAddress = 'Delivery address is required for delivery.'; setFieldErrors(next); if (Object.keys(next).length) return; setConfirm(true); };
 const commit = () => { if (editing) setRows((old) => old.map((record) => record.id === editing.id ? { ...form, id: editing.id, requestStatus: record.requestStatus } : record)); else setRows((old) => [{ ...form, id: `CHQ-${Date.now().toString().slice(-6)}`, requestStatus: 'Pending' }, ...old]); setConfirm(false); setOpen(false); setMessage(editing ? 'Cheque book request updated.' : 'Cheque book request created.'); };

 const columns: DataTableColumn<RecordItem>[] = [
  { key: 'id', label: 'Request ID', minWidth: 50, nowrap: true, render: (record) => <Box component="span" sx={{ fontWeight: 700, fontSize: 13 }}>{record.id}</Box> },
  { key: 'accountNumber', label: 'Account Number', minWidth: 25, render: (record) => record.accountNumber },
  { key: 'customerName', label: 'Customer Name', minWidth: 25, render: (record) => record.customerName },
  { key: 'chequeBookType', label: 'Cheque Book Type', minWidth: 25, render: (record) => record.chequeBookType },
  { key: 'deliveryMethod', label: 'Delivery', minWidth: 25, render: (record) => record.deliveryMethod },
  { key: 'primary', label: 'Primary', minWidth: 25, render: (record) => record.primary ? 'Yes' : 'No' },
  { key: 'default', label: 'Default', minWidth: 25, render: (record) => record.default ? 'Yes' : 'No' },
  { key: 'statusCode', label: 'Account Status', minWidth: 25, render: (record) => ACCOUNT_STATUS_OPTIONS.find((status) => status.value === record.statusCode)?.label ?? record.statusCode },
  { key: 'requestStatus', label: 'Status', minWidth: 25, nowrap: true, render: (record) => <Chip size="small" label={record.requestStatus === 'Pending' ? 'Pending for Authorisation' : record.requestStatus} color={record.requestStatus === 'Pending' ? 'warning' : record.requestStatus === 'Authorised' ? 'success' : 'error'} variant="outlined" /> },
  { key: 'actions', label: 'Actions', minWidth: 220, nowrap: true, render: (record) => record.requestStatus === 'Pending' ? <Button size="small" color="success" variant="contained" onClick={() => setSelected(record)}>Verify</Button> : <Stack direction="row" spacing={0.25}><Button size="small" disabled={record.requestStatus !== 'Authorised'} onClick={() => setSelected(record)}>View</Button><Button size="small" disabled={record.requestStatus !== 'Authorised'} onClick={() => startEdit(record)}>Edit</Button></Stack> },
 ];

 return <Box>
  <PageHeader title="Cheque Book Requests" subtitle="Create and maintain cheque book requests." />
  {message && <Alert sx={{ mb: 2 }} severity="success" onClose={() => setMessage('')}>{message}</Alert>}
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: 2.5 }}>
    <TextField size="small" fullWidth placeholder="Search account or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
    <Button size="small" variant={tab === 'view' ? 'contained' : 'outlined'} onClick={() => setTab('view')}>View</Button>
    <Button size="small" variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Pending for Authorisation ({rows.filter((record) => record.requestStatus === 'Pending').length})</Button>
   </Stack>
   <DataTable rows={filtered} columns={columns} getRowId={(record) => record.id} emptyMessage="No cheque book requests found." />
   <Box sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}><TypographyCaption count={filtered.length} total={rows.length} /></Box>
  </Paper>

  <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
   <DialogTitle>{selected?.requestStatus === 'Pending' ? 'Verify Cheque Book Request' : 'View Cheque Book Request'} {selected?.id}</DialogTitle>
   <DialogContent dividers>{selected && <Box sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr'},gap:2}}>{Object.entries(selected).filter(([key])=>key!=='id').map(([key,value])=><Box key={key}><Typography variant="caption" color="text.secondary">{key}</Typography><Typography>{String(value)}</Typography></Box>)}</Box>}</DialogContent>
   <DialogActions><Button onClick={()=>setSelected(null)}>Close</Button>{selected?.requestStatus === 'Pending' && <><Button color="error" onClick={()=>verify('Rejected')}>Reject</Button><Button color="success" variant="contained" onClick={()=>verify('Authorised')}>Verify</Button></>}</DialogActions>
  </Dialog>
  <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
   <DialogTitle sx={{ fontWeight: 800 }}>{editing ? 'Edit Cheque Book Request' : 'Create Cheque Book Request'}</DialogTitle>
   <DialogContent dividers>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
     <TextField size="small" required label="Account Number" value={form.accountNumber} error={Boolean(fieldErrors.accountNumber)} helperText={fieldErrors.accountNumber || ' '} onChange={(event) => { field('accountNumber', event.target.value); setFieldErrors((old) => ({ ...old, accountNumber: '' })); }} />
     <TextField size="small" required label="Account Name / Customer Name" value={form.customerName} error={Boolean(fieldErrors.customerName)} helperText={fieldErrors.customerName || ' '} onChange={(event) => { field('customerName', event.target.value); setFieldErrors((old) => ({ ...old, customerName: '' })); }} />
     <TextField size="small" select label="Cheque Book Type" value={form.chequeBookType} onChange={(event) => field('chequeBookType', event.target.value)}><MenuItem value="25 pages">25 pages</MenuItem><MenuItem value="50 pages">50 pages</MenuItem></TextField>
     <TextField size="small" select label="Delivery Method" value={form.deliveryMethod} onChange={(event) => field('deliveryMethod', event.target.value)}><MenuItem value="Collect from branch">Collect from branch</MenuItem><MenuItem value="Delivery address">Delivery address</MenuItem></TextField>
     {form.deliveryMethod === 'Delivery address' && <TextField size="small" label="Delivery Address" multiline value={form.deliveryAddress} error={Boolean(fieldErrors.deliveryAddress)} helperText={fieldErrors.deliveryAddress || ' '} onChange={(event) => { field('deliveryAddress', event.target.value); setFieldErrors((old) => ({ ...old, deliveryAddress: '' })); }} />}
     <TextField size="small" select label="Account Status" value={form.statusCode} onChange={(event) => field('statusCode', event.target.value)}>{ACCOUNT_STATUS_OPTIONS.map((status) => <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>)}</TextField>
     <TextField size="small" select label="Primary" value={String(form.primary)} onChange={(event) => field('primary', event.target.value === 'true')}><MenuItem value="true">Yes</MenuItem><MenuItem value="false">No</MenuItem></TextField>
     <TextField size="small" select label="Default" value={String(form.default)} onChange={(event) => field('default', event.target.value === 'true')}><MenuItem value="true">Yes</MenuItem><MenuItem value="false">No</MenuItem></TextField>
    </Box>
   </DialogContent>
   <DialogActions sx={{ p: 2 }}><Button size="small" onClick={() => setOpen(false)}>Cancel</Button><Button size="small" variant="contained" disabled={!form.accountNumber.trim() || !form.customerName.trim()} onClick={save}>Save Request</Button></DialogActions>
  </Dialog>
  <ConfirmDialog open={confirm} title="Confirm Request" message={`Confirm ${editing ? 'saving changes to' : 'creating'} this cheque book request?`} onCancel={() => setConfirm(false)} onConfirm={commit} />
 </Box>;
}

function TypographyCaption({ count, total }: { count: number; total: number }) {
 return <Box sx={{ color: 'text.secondary', fontSize: 13 }}>Showing {count} of {total} requests</Box>;
}
