import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useLocation } from 'react-router-dom';
import { getErrorMessage } from '@/services/api/apiError';
import type { RequestRecord } from './genericTypes';
import { getModuleConfig, getModuleKey, getRequiredFields } from './genericModuleConfig';
import { validateRequestForm } from './schema';
import { flatten, serverFieldErrors, useRequestModule } from './useRequestModule';

/**
 * Generic request page (locker, standing instruction, loan lead, loan EMI).
 * Data comes from the portal API; nothing is kept in the browser any more.
 */
export default function GenericRequestModule() {
 const location = useLocation();
 const config = getModuleConfig(location.pathname);
 const requiredFields = getRequiredFields(location.pathname);
 const store = useRequestModule(getModuleKey(location.pathname));
 const rows = useMemo<RequestRecord[]>(() => store.records.map((r) => flatten(r) as RequestRecord), [store.records]);
 const empty = Object.fromEntries(config.fields.map((f:any)=>[f.key, ''])) as Record<string,string>;
 const [search,setSearch]=useState(''); const [tab,setTab]=useState<'view'|'pending'>('view'); const [selected,setSelected]=useState<RequestRecord|null>(null); const [open,setOpen]=useState(false); const [editing,setEditing]=useState<RequestRecord|null>(null); const [form,setForm]=useState<Record<string,string>>(empty); const [confirm,setConfirm]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState(''); const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({});
 const filtered=useMemo(()=>rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase())&&(tab==='view'||r.requestStatus==='Pending')),[rows,search,tab]);
 const openDetail=async(r:RequestRecord)=>{try{setSelected(flatten(await store.getOne(r.id)) as RequestRecord);}catch(e){setMessage(`Please retry: ${getErrorMessage(e,'Unable to load the request.')}`);}};
 const startEdit=async(r:RequestRecord)=>{if(r.requestStatus!=='Authorised')return;try{const d=flatten(await store.getOne(r.id)) as RequestRecord;setSelected(null);setEditing(d);setForm(Object.fromEntries(config.fields.map((f:any)=>[f.key,String(d[f.key]??'')])));setError('');setFieldErrors({});setOpen(true);}catch(e){setMessage(`Please retry: ${getErrorMessage(e,'Unable to load the request.')}`);}};
 const change=(key:string,value:string)=>{setForm(old=>{const next={...old,[key]:value}; if(config.eligibility){const income=Number(next.totalIncome||0),expense=Number(next.totalExpense||0);next.eligibility=String(Math.max(0,(income-expense)*12*3));}return next;});};
 const verify=async(status:'Authorised'|'Rejected')=>{if(!selected)return;const label=String(selected.displayId??selected.id);try{await store.decide(selected.id,status);setMessage(`${label} ${status==='Authorised'?'verified':'rejected'} successfully.`);}catch(e){setMessage(`Please review: ${getErrorMessage(e,'Unable to update the request.')}`);}setSelected(null);};
 const save=()=>{const validation=validateRequestForm(form,requiredFields);setFieldErrors(validation);if(Object.keys(validation).length){setError('Please correct the highlighted fields before submitting.');return;}if(location.pathname.endsWith('loan-emi-payment')&&Number(form.debitAmount)>Number(form.currentBalance)){setError('Dear Customer, Your request has been rejected due to insufficient funds in your account. Kindly maintain sufficient balance and generate the request.');return;}setError('');setConfirm(true)};
 const commit=async()=>{try{if(editing)await store.update(editing.id,form);else await store.create(form);setConfirm(false);setOpen(false);setMessage(editing?'Request updated and sent for authorisation.':'Request created and sent for authorisation.');}catch(e){setConfirm(false);setFieldErrors(serverFieldErrors(e));setError(getErrorMessage(e,'Unable to save the request.'));}};
 const columns: DataTableColumn<RequestRecord>[] = [
  { key: 'requestId', label: 'Request ID', minWidth: 50, nowrap: true, render: (record: RequestRecord) => String(record.displayId ?? record.id) },
  ...config.columns.map((column: string, index: number) => ({
   key: `field-${index}`, label: column, minWidth: 25,
   render: (record: RequestRecord) => String(record[config.columnKeys[index]] ?? (column === 'Status' ? '002 - Operative' : '—')),
  })),
  { key: 'requestStatus', label: 'Status', minWidth: 25, nowrap: true, render: (record) => <Chip size="small" label={record.requestStatus === 'Pending' ? 'Pending for Authorisation' : record.requestStatus} color={record.requestStatus === 'Pending' ? 'warning' : record.requestStatus === 'Authorised' ? 'success' : 'error'} variant="outlined" /> },
  { key: 'actions', label: 'Actions', minWidth: 220, nowrap: true, render: (record) => record.requestStatus === 'Pending' ? <Button size="small" color="success" variant="contained" disabled={record.canVerify === false} title={record.canVerify === false ? 'Maker-checker: another user must verify this request' : undefined} onClick={() => void openDetail(record)}>Verify</Button> : <Stack direction="row" spacing={0.25}><Button size="small" disabled={record.requestStatus !== 'Authorised'} onClick={() => void openDetail(record)}>View</Button><Button size="small" disabled={record.requestStatus !== 'Authorised'} onClick={() => void startEdit(record)}>Edit</Button></Stack> },
 ];
 return <Box>
  <PageHeader
   title={config.title}
   subtitle="Create, review and maintain banking service requests."
  />
  {store.error && <Alert sx={{ mb: 2 }} severity="error">{store.error}</Alert>}
  {message && <Alert sx={{ mb: 2 }} severity={message.startsWith('Please') ? 'warning' : 'success'} onClose={() => setMessage('')}>{message}</Alert>}
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
   <Box sx={{ p: 2.5 }}>
    <TextField size="small" fullWidth placeholder="Search requests" value={search} onChange={(event) => setSearch(event.target.value)} />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }}>
     <Button size="small" variant={tab === 'view' ? 'contained' : 'outlined'} onClick={() => setTab('view')}>View</Button>
     {config.tabs.includes('Pending for Authorisation') && <Button size="small" variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Pending for Authorisation ({rows.filter((record) => record.requestStatus === 'Pending').length})</Button>}
    </Stack>
   </Box>
   <DataTable rows={filtered} columns={columns} getRowId={(record) => record.id} emptyMessage={store.loading ? 'Loading requests…' : 'No requests found.'} />
   <Stack direction="row" justifyContent="space-between" sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">Showing {filtered.length} of {rows.length} requests</Typography>
    <Typography variant="body2" color="text.secondary">Pending: {rows.filter((record) => record.requestStatus === 'Pending').length}</Typography>
   </Stack>
  </Paper>
  <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
   <DialogTitle sx={{fontWeight:800}}>{selected?.requestStatus === 'Pending' ? 'Verify Request' : 'View Request'} {selected?.displayId ?? selected?.id}</DialogTitle>
   <DialogContent dividers>{selected && <><Alert severity={selected.requestStatus === 'Pending' ? 'warning' : 'success'} sx={{mb:2}}>Status: {selected.requestStatus === 'Pending' ? 'Pending for Authorisation' : selected.requestStatus}</Alert><Box sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr'},gap:2}}>{config.fields.map((f:any)=><Box key={f.key}><Typography variant="caption" color="text.secondary">{f.label}</Typography><Typography>{selected[f.key] || '—'}</Typography></Box>)}</Box></>}</DialogContent>
   <DialogActions><Button size="small" onClick={()=>setSelected(null)}>Close</Button>{selected?.requestStatus === 'Pending' && selected.canVerify !== false && <><Button size="small" color="error" onClick={()=>void verify('Rejected')}>Reject</Button><Button size="small" color="success" variant="contained" onClick={()=>void verify('Authorised')}>Verify</Button></>}</DialogActions>
  </Dialog>
  <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" scroll="paper" PaperProps={{ sx: { maxHeight: 'calc(100% - 32px)', m: 2, width: '100%' } }}>
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
  <ConfirmDialog open={confirm} title="Confirm Request" message={`Confirm ${editing ? 'updating' : 'submitting'} this request?`} onCancel={() => setConfirm(false)} onConfirm={() => void commit()} />
 </Box>;
}
