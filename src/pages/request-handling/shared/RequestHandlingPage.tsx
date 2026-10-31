import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import type { RequestModuleConfig, RequestRecord, RequestStatus } from './types';
import { validateRequestFields } from './schema';
export default function RequestHandlingPage({ config }: {config: RequestModuleConfig}) {
 const [records,setRecords]=useState<RequestRecord[]>(config.initialRecords); const [search,setSearch]=useState('');
 const [tab,setTab]=useState<'view'|'pending'>('view'); const [selected,setSelected]=useState<RequestRecord|null>(null);
 const [formOpen,setFormOpen]=useState(false); const [confirmOpen,setConfirmOpen]=useState(false); const [editing,setEditing]=useState<RequestRecord|null>(null);
 const [fields,setFields]=useState<Record<string,string>>({}); const [feedback,setFeedback]=useState('');
 const filtered=useMemo(()=>records.filter(r=>`${r.id} ${r.status} ${r.submittedOn} ${Object.values(r.fields).join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (tab==='view'||r.status==='Pending')),[records,search,tab]);
 const startCreate=()=>{setEditing(null);setFields(Object.fromEntries(config.detailFields.map(f=>[f.key,''])));setFormOpen(true)};
 const startEdit=(r:RequestRecord)=>{setEditing(r);setFields({...r.fields});setFormOpen(true)};
 const save=()=>{const required=config.detailFields.slice(0,2).map(f=>f.key); if(!validateRequestFields(fields,required)){setFeedback(`Please complete: ${config.detailFields.slice(0,2).map(f=>f.label).join(' and ')}.`);return;}setConfirmOpen(true)};
 const commit=()=>{if(editing){setRecords(old=>old.map(r=>r.id===editing.id?{...r,fields:{...fields}}:r));setFeedback('Request updated successfully.')}else{setRecords(old=>[{id:`REQ-${Date.now().toString().slice(-6)}`,status:'Pending',submittedOn:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),fields:{...fields}},...old]);setFeedback('Request created and sent for authorisation.')}setConfirmOpen(false);setFormOpen(false)};
 const decide=(status:RequestStatus)=>{if(!selected)return;setRecords(old=>old.map(r=>r.id===selected.id?{...r,status}:r));setFeedback(`${selected.id} ${status.toLowerCase()} successfully.`);setSelected(null)};
 const columns: DataTableColumn<RequestRecord>[] = [
  { key: 'id', label: 'Request ID', minWidth: 125, nowrap: true, render: (record) => <Typography fontWeight={700} fontSize={13}>{record.id}</Typography> },
  ...config.columns.map((column) => ({ key: column.key, label: column.label, minWidth: 130, nowrap: true, render: (record: RequestRecord) => record.fields[column.key] || '—' })),
  { key: 'status', label: 'Status', minWidth: 110, render: (record) => <Chip size="small" variant="outlined" color={record.status === 'Pending' ? 'warning' : record.status === 'Authorised' ? 'success' : 'error'} label={record.status} /> },
  { key: 'actions', label: 'Actions', minWidth: 140, nowrap: true, render: (record) => <Stack direction="row" spacing={0.5}><Button size="small" onClick={() => setSelected(record)}>View</Button><Button size="small" onClick={() => startEdit(record)}>Edit</Button></Stack> },
 ];
 return <Box>
  <PageHeader title={config.title} subtitle={config.description} />
  {feedback && <Alert sx={{ mb: 2 }} severity={feedback.startsWith('Please') ? 'warning' : 'success'} onClose={() => setFeedback('')}>{feedback}</Alert>}
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
   <Box sx={{ p: 2.5 }}>
    <TextField size="small" fullWidth placeholder={config.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }}>
     <Button size="small" variant={tab === 'view' ? 'contained' : 'outlined'} onClick={() => setTab('view')}>View</Button>
     <Button size="small" variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Request for Pending ({records.filter((record) => record.status === 'Pending').length})</Button>
     <Box sx={{ flex: 1 }} />
     {!config.hideCreateButton && <Button size="small" variant="contained" onClick={startCreate}>Create</Button>}
    </Stack>
   </Box>
   <DataTable rows={filtered} columns={columns} getRowId={(record) => record.id} emptyMessage="No requests found." />
   <Stack direction="row" justifyContent="space-between" sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">Showing {filtered.length} of {records.length} requests</Typography>
    <Typography variant="body2" color="text.secondary">Pending: {records.filter((record) => record.status === 'Pending').length}</Typography>
   </Stack>
  </Paper>
  <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
   <DialogTitle sx={{ fontWeight: 800 }}>View Request {selected?.id}</DialogTitle>
   <DialogContent dividers>{selected && <><Alert severity="info" sx={{ mb: 2 }}>Status: {selected.status}</Alert><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>{config.detailFields.map((field) => <Box key={field.key}><Typography variant="caption" color="text.secondary">{field.label}</Typography><Typography>{selected.fields[field.key] || '—'}</Typography></Box>)}</Box><Divider sx={{ my: 2 }} /></>}</DialogContent>
   <DialogActions><Button size="small" onClick={() => setSelected(null)}>Close</Button>{selected?.status === 'Pending' && <><Button size="small" color="error" onClick={() => decide('Rejected')}>Reject</Button><Button size="small" variant="contained" onClick={() => decide('Authorised')}>Authorise</Button></>}</DialogActions>
  </Dialog>
  <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="md">
   <DialogTitle sx={{ fontWeight: 800 }}>{editing ? 'Edit' : 'Create'} {config.title.replace(/ Requests?$/, '')} Request</DialogTitle>
   <DialogContent dividers><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>{config.detailFields.map((field, index) => <TextField key={field.key} size="small" label={field.label} required={index < 2} value={fields[field.key] ?? ''} onChange={(event) => setFields((old) => ({ ...old, [field.key]: event.target.value }))} multiline={['remarks', 'reason'].includes(field.key)} minRows={['remarks', 'reason'].includes(field.key) ? 2 : 1} />)}</Box></DialogContent>
   <DialogActions sx={{ p: 2 }}><Button size="small" onClick={() => setFormOpen(false)}>Cancel</Button><Button size="small" variant="contained" onClick={save}>Submit</Button></DialogActions>
  </Dialog>
  <ConfirmDialog open={confirmOpen} title="Confirm Request" message={`Confirm ${editing ? 'updating' : 'creating'} this request?`} onCancel={() => setConfirmOpen(false)} onConfirm={commit} />
 </Box>;
}
