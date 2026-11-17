import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ACCOUNT_STATUS_OPTIONS } from '@/constants/accountStatus';
import { getErrorMessage } from '@/services/api/apiError';
import { flatten, serverFieldErrors, useRequestModule } from '../../shared/useRequestModule';

type RecordItem = { id: string; displayId?: string; canVerify?: boolean; requestStatus: 'Pending' | 'Authorised' | 'Rejected'; accountNumber: string; customerName: string; chequeBookType: string; deliveryMethod: string; deliveryAddress: string; primary: boolean; default: boolean; statusCode: string };
type FormData = Omit<RecordItem, 'id' | 'requestStatus'>;
const empty: FormData = { accountNumber: '', customerName: '', chequeBookType: '25 pages', deliveryMethod: 'Collect from branch', deliveryAddress: '', primary: false, default: false, statusCode: '001' };

export default function ChequeBookPage() {
 const store = useRequestModule('cheque-book');
 const rows = useMemo<RecordItem[]>(() => store.records.map((r) => ({ ...empty, ...flatten(r) } as unknown as RecordItem)), [store.records]);
 const [search, setSearch] = useState('');
 const [tab, setTab] = useState<'view' | 'pending'>('view');
 const [open, setOpen] = useState(false);
 const [selected, setSelected] = useState<RecordItem | null>(null);
 const [confirm, setConfirm] = useState(false);
 const [decisionConfirm, setDecisionConfirm] = useState<'Authorised' | 'Rejected' | null>(null);
 const [editing, setEditing] = useState<RecordItem | null>(null);
 const [form, setForm] = useState<FormData>(empty);
 const [message, setMessage] = useState('');
 const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
 const filtered = useMemo(() => rows.filter((record) => `${record.id} ${record.accountNumber} ${record.customerName}`.toLowerCase().includes(search.toLowerCase()) && (tab === 'view' || record.requestStatus === 'Pending')), [rows, search, tab]);

 const field = (key: keyof typeof empty, value: string | boolean) => setForm((old) => ({ ...old, [key]: value }));
 const startNew = () => { setEditing(null); setForm(empty); setFieldErrors({}); setOpen(true); };
 const openDetail = async (record: RecordItem) => { try { setSelected({ ...empty, ...flatten(await store.getOne(record.id)) } as unknown as RecordItem); } catch (e) { setMessage(`Please retry: ${getErrorMessage(e, 'Unable to load the request.')}`); } };

 const verify = async (decision: 'Authorised' | 'Rejected') => {
   if (!selected) return;
   const label = selected.displayId ?? selected.id;
   try {
     await store.decide(selected.id, decision);
     setMessage(`${label} ${decision === 'Authorised' ? 'verified' : 'rejected'} successfully.`);
   } catch (e) {
     setMessage(`Please review: ${getErrorMessage(e, 'Unable to update the request.')}`);
   }
   setDecisionConfirm(null);
   setSelected(null);
 };
 const requestDecision = (decision: 'Authorised' | 'Rejected') => setDecisionConfirm(decision);

 const save = () => {
   const next: Record<string, string> = {};
   if (!form.accountNumber.trim()) next.accountNumber = 'Account number is required.';
   else if (!/^[A-Za-z0-9 Xx-]{4,24}$/.test(form.accountNumber.trim())) next.accountNumber = 'Enter a valid account number.';
   if (form.deliveryMethod === 'Delivery address' && !form.deliveryAddress.trim()) next.deliveryAddress = 'Delivery address is required for delivery.';
   setFieldErrors(next);
   if (Object.keys(next).length) return;
   setConfirm(true);
 };
 const commit = async () => {
   try {
     if (editing) await store.update(editing.id, form);
     else await store.create(form);
     setConfirm(false);
     setOpen(false);
     setMessage(editing ? 'Cheque book request updated and sent for authorisation.' : 'Cheque book request created and sent for authorisation.');
   } catch (e) {
     setConfirm(false);
     setFieldErrors(serverFieldErrors(e));
     setMessage(`Please correct the highlighted fields. ${getErrorMessage(e, '')}`);
   }
 };

 // These are the actual business-data columns rendered in the grid.
 // The View dialog intentionally uses only these fields and does not expose hidden form fields.
 const viewFields: Array<[keyof RecordItem, string]> = [
   ['accountNumber', 'Account Number'],
   ['customerName', 'Customer Name'],
   ['chequeBookType', 'Cheque Book Type'],
   ['deliveryMethod', 'Delivery'],
   ['primary', 'Primary'],
   ['default', 'Default'],
   ['statusCode', 'Account Status'],
 ];

 const columns: DataTableColumn<RecordItem>[] = [
  { key: 'id', label: 'Request ID', minWidth: 50, nowrap: true, render: (record) => <Box component="span" sx={{ fontWeight: 700, fontSize: 13 }}>{record.displayId ?? record.id}</Box> },
  { key: 'accountNumber', label: 'Account Number', minWidth: 25, render: (record) => record.accountNumber },
  { key: 'customerName', label: 'Customer Name', minWidth: 25, render: (record) => record.customerName },
  { key: 'chequeBookType', label: 'Cheque Book Type', minWidth: 25, render: (record) => record.chequeBookType },
  { key: 'deliveryMethod', label: 'Delivery', minWidth: 25, render: (record) => record.deliveryMethod },
  { key: 'primary', label: 'Primary', minWidth: 25, render: (record) => record.primary ? 'Yes' : 'No' },
  { key: 'default', label: 'Default', minWidth: 25, render: (record) => record.default ? 'Yes' : 'No' },
  { key: 'statusCode', label: 'Account Status', minWidth: 25, render: (record) => ACCOUNT_STATUS_OPTIONS.find((status) => status.value === record.statusCode)?.label ?? record.statusCode },
  { key: 'requestStatus', label: 'Status', minWidth: 25, nowrap: true, render: (record) => <Chip size="small" label={record.requestStatus === 'Pending' ? 'Pending for Authorisation' : record.requestStatus} color={record.requestStatus === 'Pending' ? 'warning' : record.requestStatus === 'Authorised' ? 'success' : 'error'} variant="outlined" /> },
  { key: 'actions', label: 'Actions', minWidth: 220, nowrap: true, render: (record) => record.requestStatus === 'Pending' ? <Button size="small" color="success" variant="contained" disabled={record.canVerify === false} title={record.canVerify === false ? 'Maker-checker: another user must verify this request' : undefined} onClick={() => void openDetail(record)}>Verify</Button> : <Stack direction="row" spacing={0.25}><Button size="small" disabled={record.requestStatus !== 'Authorised'} onClick={() => void openDetail(record)}>View</Button></Stack> },
 ];

 return <Box>
  <PageHeader title="Cheque Book Requests" subtitle="Create and maintain cheque book requests." />
  {store.error && <Alert sx={{ mb: 2 }} severity="error">{store.error}</Alert>}
  {message && <Alert sx={{ mb: 2 }} severity={message.startsWith('Please') ? 'warning' : 'success'} onClose={() => setMessage('')}>{message}</Alert>}

  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: 2.5 }}>
    <TextField size="small" fullWidth placeholder="Search account or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
    <Button size="small" variant={tab === 'view' ? 'contained' : 'outlined'} onClick={() => setTab('view')}>View</Button>
    <Button size="small" variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Pending for Authorisation ({rows.filter((record) => record.requestStatus === 'Pending').length})</Button>
    {/* Create is intentionally available only in the Payments menu. */}
     {/* <Button size="small" variant="contained" onClick={startNew}>Create</Button> */}
   </Stack>
   <DataTable rows={filtered} columns={columns} getRowId={(record) => record.id} emptyMessage="No cheque book requests found." />
   <Box sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}><TypographyCaption count={filtered.length} total={rows.length} /></Box>
  </Paper>

  <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="lg">
   <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
    Verify Cheque Book Request — {selected?.displayId ?? selected?.id}
   </DialogTitle>
   <DialogContent dividers sx={{ p: 2 }}>
    {selected && <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
       <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Request Details</Typography>
       <Stack direction="row" spacing={1}>
        <Chip size="small" variant="outlined" label={ACCOUNT_STATUS_OPTIONS.find((status) => status.value === selected.statusCode)?.label ?? selected.statusCode ?? '—'} />
        <Chip size="small" label="Pending for Authorisation" color="warning" />
       </Stack>
      </Box>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
       <Box sx={{ px: 1.5, py: 1, bgcolor: 'action.hover' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Cheque Book Details</Typography>
       </Box>
       <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))' }, p: 1.25 }}>
        {viewFields.map(([key, label]) => <Box key={String(key)} sx={{ p: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, mt: .25, overflowWrap: 'anywhere' }}>
           {key === 'primary' || key === 'default' ? (selected[key] ? 'Yes' : 'No') : key === 'statusCode' ? (ACCOUNT_STATUS_OPTIONS.find((status) => status.value === selected.statusCode)?.label ?? selected.statusCode ?? '—') : String(selected[key] ?? '—')}
          </Typography>
        </Box>)}
       </Box>
      </Box>
    </>}
   </DialogContent>
   <DialogActions sx={{ px: 2, py: 1.5 }}>
    <Button size="small" onClick={() => setSelected(null)}>Close</Button>
    {selected?.canVerify !== false && <>
      <Button size="small" color="error" variant="outlined" onClick={() => requestDecision('Rejected')}>Reject</Button>
      <Button size="small" color="success" variant="contained" onClick={() => requestDecision('Authorised')}>Verify</Button>
    </>}
   </DialogActions>
  </Dialog>

  <Dialog open={!!selected && selected.requestStatus !== 'Pending'} onClose={() => setSelected(null)} fullWidth maxWidth="lg">
   <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>View Cheque Book Request — {selected?.displayId ?? selected?.id}</DialogTitle>
   <DialogContent dividers sx={{ p: 2 }}>
    {selected && <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
       <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Request Details</Typography>
       <Chip size="small" label={selected.requestStatus} color={selected.requestStatus === 'Rejected' ? 'error' : 'success'} variant="outlined" />
      </Box>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
       <Box sx={{ px: 1.5, py: 1, bgcolor: 'action.hover' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Cheque Book Details</Typography>
       </Box>
       <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))' }, p: 1.25 }}>
        {viewFields.map(([key, label]) => <Box key={String(key)} sx={{ p: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, mt: .25, overflowWrap: 'anywhere' }}>
           {key === 'primary' || key === 'default' ? (selected[key] ? 'Yes' : 'No') : key === 'statusCode' ? (ACCOUNT_STATUS_OPTIONS.find((status) => status.value === selected.statusCode)?.label ?? selected.statusCode ?? '—') : String(selected[key] ?? '—')}
          </Typography>
        </Box>)}
       </Box>
      </Box>
    </>}
   </DialogContent>
   <DialogActions sx={{ px: 2, py: 1.5 }}><Button size="small" onClick={() => setSelected(null)}>Close</Button></DialogActions>
  </Dialog>

  <ConfirmDialog
   open={decisionConfirm !== null}
   title={decisionConfirm === 'Rejected' ? 'Confirm Rejection' : 'Confirm Verification'}
   message={decisionConfirm === 'Rejected' ? 'Are you sure you want to reject this request?' : 'Are you sure you want to verify this request?'}
   confirmText={decisionConfirm === 'Rejected' ? 'Reject' : 'Verify'}
   variant={decisionConfirm === 'Rejected' ? 'danger' : 'warning'}
   onCancel={() => setDecisionConfirm(null)}
   onConfirm={() => decisionConfirm && void verify(decisionConfirm)}
  />

  <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
   <DialogTitle sx={{ fontWeight: 800 }}>{editing ? 'Edit Cheque Book Request' : 'Create Cheque Book Request'}</DialogTitle>
   <DialogContent dividers>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
     <TextField size="small" required disabled={Boolean(editing)} label="Account Number" value={form.accountNumber} error={Boolean(fieldErrors.accountNumber)} helperText={fieldErrors.accountNumber || ' '} onChange={(event) => { field('accountNumber', event.target.value); setFieldErrors((old) => ({ ...old, accountNumber: '' })); }} />
     <TextField size="small" disabled label="Account Name / Customer Name (filled from the account)" value={form.customerName} error={Boolean(fieldErrors.customerName)} helperText={fieldErrors.customerName || ' '} onChange={(event) => { field('customerName', event.target.value); setFieldErrors((old) => ({ ...old, customerName: '' })); }} />
     <TextField size="small" select label="Cheque Book Type" value={form.chequeBookType} onChange={(event) => field('chequeBookType', event.target.value)}><MenuItem value="25 pages">25 pages</MenuItem><MenuItem value="50 pages">50 pages</MenuItem></TextField>
     <TextField size="small" select label="Delivery Method" value={form.deliveryMethod} onChange={(event) => field('deliveryMethod', event.target.value)}><MenuItem value="Collect from branch">Collect from branch</MenuItem><MenuItem value="Delivery address">Delivery address</MenuItem></TextField>
     {form.deliveryMethod === 'Delivery address' && <TextField size="small" label="Delivery Address" multiline value={form.deliveryAddress} error={Boolean(fieldErrors.deliveryAddress)} helperText={fieldErrors.deliveryAddress || ' '} onChange={(event) => { field('deliveryAddress', event.target.value); setFieldErrors((old) => ({ ...old, deliveryAddress: '' })); }} />}
     <TextField size="small" select label="Account Status" value={form.statusCode} onChange={(event) => field('statusCode', event.target.value)}>{ACCOUNT_STATUS_OPTIONS.map((status) => <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>)}</TextField>
     <TextField size="small" select label="Primary" value={String(form.primary)} onChange={(event) => field('primary', event.target.value === 'true')}><MenuItem value="true">Yes</MenuItem><MenuItem value="false">No</MenuItem></TextField>
     <TextField size="small" select label="Default" value={String(form.default)} onChange={(event) => field('default', event.target.value === 'true')}><MenuItem value="true">Yes</MenuItem><MenuItem value="false">No</MenuItem></TextField>
    </Box>
   </DialogContent>
   <DialogActions sx={{ p: 2 }}><Button size="small" onClick={() => setOpen(false)}>Cancel</Button><Button size="small" variant="contained" disabled={!form.accountNumber.trim()} onClick={save}>Save Request</Button></DialogActions>
  </Dialog>
  <ConfirmDialog open={confirm} title="Confirm Request" message={`Confirm ${editing ? 'saving changes to' : 'creating'} this cheque book request?`} onCancel={() => setConfirm(false)} onConfirm={() => void commit()} />
 </Box>;
}

function TypographyCaption({ count, total }: { count: number; total: number }) {
 return <Box sx={{ color: 'text.secondary', fontSize: 13 }}>Showing {count} of {total} requests</Box>;
}
