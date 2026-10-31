import { useEffect, useMemo, useState, type SetStateAction } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useLocation } from 'react-router-dom';
import type { RequestRecord } from './genericTypes';
import { getModuleConfig, getSampleRows, getRequiredFields } from './genericModuleConfig';
import { validateRequestForm } from './schema';

const STORAGE_PREFIX = 'bank-request-handling:';

function createRows(sampleRows: any[]): RequestRecord[] {
 return sampleRows.map((record: any, index: number) => ({
  id: `REQ-${1001 + index}`,
  requestStatus: index === 0 ? 'Pending' : index === 1 ? 'Authorised' : index === 2 ? 'Pending' : 'Rejected',
  ...record,
 }));
}

function loadRows(path: string, sampleRows: any[]): RequestRecord[] {
 const fallback = createRows(sampleRows);
 try {
  const saved = window.localStorage.getItem(`${STORAGE_PREFIX}${path}`);
  if (!saved) return fallback;
  const parsed: unknown = JSON.parse(saved);
  return Array.isArray(parsed) && parsed.length > 0 ? parsed as RequestRecord[] : fallback;
 } catch {
  return fallback;
 }
}
export default function GenericRequestModule() {
 const location = useLocation(); const config = getModuleConfig(location.pathname); const sampleRows = getSampleRows(location.pathname); const requiredFields = getRequiredFields(location.pathname);
 const empty = Object.fromEntries(config.fields.map((f:any)=>[f.key, ''])) as Record<string,string>;
 const [rowsState, setRowsState] = useState<{ path: string; rows: RequestRecord[] }>(() => ({
  path: location.pathname,
  rows: loadRows(location.pathname, sampleRows),
 }));
 const rows = rowsState.path === location.pathname ? rowsState.rows : loadRows(location.pathname, sampleRows);
 const setRows = (updater: SetStateAction<RequestRecord[]>) => {
  setRowsState((current) => {
   const currentRows = current.path === location.pathname ? current.rows : loadRows(location.pathname, sampleRows);
   const nextRows = typeof updater === 'function' ? updater(currentRows) : updater;
   return { path: location.pathname, rows: nextRows };
  });
 };
 useEffect(() => {
  if (rowsState.path !== location.pathname) {
   setRowsState({ path: location.pathname, rows: loadRows(location.pathname, sampleRows) });
  }
 }, [location.pathname, rowsState.path, sampleRows]);
 useEffect(() => {
  if (rowsState.path === location.pathname) {
   try { window.localStorage.setItem(`${STORAGE_PREFIX}${location.pathname}`, JSON.stringify(rowsState.rows)); } catch { /* Storage may be unavailable; sample rows still render. */ }
  }
 }, [location.pathname, rowsState]);
 const [search,setSearch]=useState(''); const [tab,setTab]=useState<'view'|'pending'>('view'); const [open,setOpen]=useState(false); const [editing,setEditing]=useState<RequestRecord|null>(null); const [form,setForm]=useState<Record<string,string>>(empty); const [confirm,setConfirm]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState(''); const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({});
 const filtered=useMemo(()=>rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase())&&(tab==='view'||r.requestStatus==='Pending')),[rows,search,tab]);
 const startNew=()=>{setEditing(null);setForm({...empty});setError('');setFieldErrors({});setOpen(true)};
 const startEdit=(r:RequestRecord)=>{setEditing(r);setForm(Object.fromEntries(config.fields.map((f:any)=>[f.key,String(r[f.key]??'')])));setError('');setFieldErrors({});setOpen(true)};
 const change=(key:string,value:string)=>{setForm(old=>{const next={...old,[key]:value}; if(config.eligibility){const income=Number(next.totalIncome||0),expense=Number(next.totalExpense||0);next.eligibility=String(Math.max(0,(income-expense)*12*3));}return next;});};
 const save=()=>{const validation=validateRequestForm(form,requiredFields);setFieldErrors(validation);if(Object.keys(validation).length){setError('Please correct the highlighted fields before submitting.');return;}if(location.pathname.endsWith('loan-emi-payment')&&Number(form.debitAmount)>Number(form.currentBalance)){setError('Dear Customer, Your request has been rejected due to insufficient funds in your account. Kindly maintain sufficient balance and generate the request.');return;}setError('');setConfirm(true)};
 const commit=()=>{if(editing)setRows(old=>old.map(r=>r.id===editing.id?{...r,...form}:r));else setRows(old=>[{id:`REQ-${Date.now().toString().slice(-6)}`,requestStatus:'Pending',...form},...old]);setConfirm(false);setOpen(false);setMessage(editing?'Request updated successfully.':'Request created and sent for authorisation.');};
 const columns: DataTableColumn<RequestRecord>[] = [
  ...config.columns.map((column: string, index: number) => ({
   key: `field-${index}`, label: column, minWidth: 130, nowrap: true,
   render: (record: RequestRecord) => String(record[config.columnKeys[index]] ?? (column === 'Status' ? '002 - Operative' : '—')),
  })),
  { key: 'requestStatus', label: 'Request Status', minWidth: 130, render: (record) => <Chip size="small" label={record.requestStatus} color={record.requestStatus === 'Pending' ? 'warning' : record.requestStatus === 'Authorised' ? 'success' : 'error'} variant="outlined" /> },
  { key: 'actions', label: 'Actions', minWidth: 130, nowrap: true, render: (record) => <Button size="small" onClick={() => startEdit(record)}>View / Edit</Button> },
 ];
 return <Box>
  <PageHeader
   title={config.title}
   subtitle="Create, review and maintain banking service requests."

  />
  {message && <Alert sx={{ mb: 2 }} severity="success" onClose={() => setMessage('')}>{message}</Alert>}
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
   <Box sx={{ p: 2.5 }}>
    <TextField size="small" fullWidth placeholder="Search requests" value={search} onChange={(event) => setSearch(event.target.value)} />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }}>
     <Button size="small" variant={tab === 'view' ? 'contained' : 'outlined'} onClick={() => setTab('view')}>View</Button>
     {config.tabs.includes('Pending for Authorisation') && <Button size="small" variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Request for Pending ({rows.filter((record) => record.requestStatus === 'Pending').length})</Button>}
    </Stack>
   </Box>
   <DataTable rows={filtered} columns={columns} getRowId={(record) => record.id} emptyMessage="No requests found." />
   <Stack direction="row" justifyContent="space-between" sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">Showing {filtered.length} of {rows.length} requests</Typography>
    <Typography variant="body2" color="text.secondary">Pending: {rows.filter((record) => record.requestStatus === 'Pending').length}</Typography>
   </Stack>
  </Paper>
  <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" scroll="paper" slotProps={{ paper: { sx: { maxHeight: 'calc(100% - 32px)', m: 2, width: '100%' } } }}>
   <DialogTitle sx={{ pr: 7, lineHeight: 1.35, overflowWrap: 'anywhere', fontWeight: 800 }}>{editing ? `Edit ${config.formTitle}` : config.formTitle}</DialogTitle>
   <DialogContent dividers sx={{ overflowY: 'auto', minWidth: 0 }}>
    <Stack spacing={2} sx={{ pt: 1, minWidth: 0 }}>
     {config.sections.map((section: any) => <Box key={section.title} sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>{section.title}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
       {config.fields.filter((field: any) => section.fields.includes(field.key)).map((field: any) => <TextField key={field.key} fullWidth size="small" type={field.type === 'select' ? 'text' : field.type} select={field.type === 'select'} required={field.required} label={field.label} error={Boolean(fieldErrors[field.key])} helperText={fieldErrors[field.key] || ' '} InputLabelProps={field.type === 'date' ? { shrink: true } : undefined} sx={{ minWidth: 0 }} value={form[field.key] ?? ''} onChange={(event) => { change(field.key, event.target.value); setFieldErrors((old) => ({ ...old, [field.key]: '' })); }} inputProps={field.type === 'number' ? { min: 0 } : undefined}>{field.type === 'select' && field.options.map((option: string) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</TextField>)}
      </Box>
     </Box>)}
     {config.notifications?.map((notification: any) => <Alert key={notification[0]} severity="info"><b>{notification[0]}:</b> {notification[1]}</Alert>)}
     {error && <Alert severity="error">{error}</Alert>}
    </Stack>
   </DialogContent>
   <DialogActions sx={{ p: 2 }}>
    <Button size="small" onClick={() => setOpen(false)}>Cancel</Button>
    <Button size="small" variant="contained" onClick={save}>Submit</Button>
   </DialogActions>
  </Dialog>
  <ConfirmDialog open={confirm} title="Confirm Request" message={`Confirm ${editing ? 'updating' : 'submitting'} this request?`} onCancel={() => setConfirm(false)} onConfirm={commit} />
 </Box>;
}
