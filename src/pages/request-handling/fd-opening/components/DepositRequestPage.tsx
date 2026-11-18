import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import { getErrorMessage } from '@/services/api/apiError';
import type { RequestHandlingModule } from '@/services/request-handling.service';
import { serverFieldErrors, useRequestModule } from '../../shared/useRequestModule';

export type DepositMode = 'opening' | 'closing';
export interface DepositConfig { title: string; mode: DepositMode; product: 'FD'|'RD'|'BOTH'; }
type RecordItem = { id:string; displayId?:string; canVerify?:boolean; status:string; fields:Record<string,string | boolean> };

const openingFields = [
 ['debitAccountId','Debit Account ID'],['accountStatus','A/c Status'],['availableBalance','Available Balance'],['customerNo','Customer No'],['name','Name'],['productCode','Product Code'],['productName','Product Name'],['schemeCode','Scheme Code'],['schemeName','Scheme Name'],['certificateDate','Certificate Date'],['depositAmount','Deposit / Instal Amt'],['asOfDate','As of Date'],['interestRate','Interest Rate (%)'],['offsetRate','Offset Rate (%)'],['tenure','Tenure (mths)'],['autoRenewal','Auto Renewal'],['interestCreditAccount','Interest Credit A/c'],['renewWithInterest','Renew with Interest'],['maturityCreditAccount','Maturity Credit A/c']
];
const closingFields = [
 ['debitAccountId','Debit Account ID'],['debitStatus','Debit A/c Status'],['name','Name'],['depositAmount','Deposit Amount'],['tenure','Tenure (mths)'],['interestRate','Interest Rate (%)'],['certificateDate','Certificate Date'],['maturityValue','Maturity Value'],['maturityDate','Maturity Date'],['creditAccountId','Credit Account ID'],['creditStatus','Credit A/c Status'],['creditName','Credit Account Name']
];

export default function DepositRequestPage({config}:{config:DepositConfig}) {
 const moduleKey: RequestHandlingModule = config.mode==='closing' ? 'closing-accounts' : config.product==='RD' ? 'rd-opening' : 'fd-opening';
 const store=useRequestModule(moduleKey);
 const rows: RecordItem[] = store.records;
 const [tab,setTab]=useState<'view'|'pending'>('view');
 const [search,setSearch]=useState('');
 const [formOpen,setFormOpen]=useState(false);
 const [editing,setEditing]=useState<RecordItem|null>(null);
 const [confirm,setConfirm]=useState(false);
 const [view,setView]=useState<RecordItem|null>(null);
 const [selected,setSelected]=useState<RecordItem|null>(null);
 const [decisionConfirm,setDecisionConfirm]=useState<'Authorised'|'Rejected'|null>(null);
 const [feedback,setFeedback]=useState('');
 const fields=config.mode==='opening'?openingFields:closingFields;
 const [values,setValues]=useState<Record<string,string>>({});
 const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({});

 const isPending=(r:RecordItem)=>r.status==='001 - Entered'||r.status==='Pending';
 const filtered=useMemo(()=>rows.filter(r=>(tab==='view'||isPending(r))&&`${r.id} ${Object.values(r.fields).join(' ')} ${r.status}`.toLowerCase().includes(search.toLowerCase())),[rows,tab,search]);

 const create=()=>{setEditing(null);setValues(Object.fromEntries(fields.map(([k])=>[k,''])));setFieldErrors({});setFeedback('');setFormOpen(true)};
 const openView=async(r:RecordItem)=>{try{setView(await store.getOne(r.id));}catch(e){setFeedback(`Please retry: ${getErrorMessage(e,'Unable to load the request.')}`)}};
 const openSelected=async(r:RecordItem)=>{try{setSelected(await store.getOne(r.id));}catch(e){setFeedback(`Please retry: ${getErrorMessage(e,'Unable to load the request.')}`)}};

 const verify=async(decision:'Authorised'|'Rejected')=>{
   if(!selected)return;
   const label=selected.displayId??selected.id;
   try{
     await store.decide(selected.id,decision);
     setFeedback(`${label} ${decision==='Authorised'?'verified':'rejected'} successfully.`);
   }catch(e){
     setFeedback(`Please review: ${getErrorMessage(e,'Unable to update the request.')}`);
   }
   setDecisionConfirm(null);
   setSelected(null);
 };
 const requestDecision=(decision:'Authorised'|'Rejected')=>setDecisionConfirm(decision);

 const submit=()=>{
   const required=config.mode==='opening'?['debitAccountId','productCode','depositAmount','tenure']:['debitAccountId','creditAccountId'];
   const errors:Record<string,string>={};
   required.forEach(k=>{if(!String(values[k]??'').trim())errors[k]='This field is required.'});
   for(const key of ['depositAmount','tenure','interestRate','offsetRate','maturityValue']){
     const value=String(values[key]??'').trim();
     if(value&&(!Number.isFinite(Number(value))||Number(value)<0))errors[key]='Enter a valid non-negative number.';
   }
   for(const key of ['certificateDate','asOfDate','maturityDate']){
     const value=String(values[key]??'').trim();
     if(value&&Number.isNaN(Date.parse(value)))errors[key]='Enter a valid date.';
   }
   if(values.depositAmount&&Number(values.depositAmount)<=0)errors.depositAmount='Amount must be greater than zero.';
   if(values.tenure&&Number(values.tenure)<=0)errors.tenure='Tenure must be greater than zero.';
   setFieldErrors(errors);
   if(Object.keys(errors).length){setFeedback('Please correct the highlighted fields before submitting.');return;}
   setFeedback('');
   setConfirm(true);
 };
 const commit=async()=>{
   try{
     if(editing){await store.update(editing.id,values);setFeedback('Request updated and sent for authorisation.')}
     else{await store.create(values);setFeedback('Request submitted for authorisation.')}
     setConfirm(false);setFormOpen(false);
   }catch(e){
     setConfirm(false);setFieldErrors(serverFieldErrors(e));setFeedback(`Please correct the highlighted fields before submitting. ${getErrorMessage(e,'')}`)
   }
 };

 // These are the actual business-data columns rendered in the grid.
 // The View dialog intentionally uses only these fields (not hidden form fields).
 const visibleKeys = config.mode === 'opening'
  ? [['branch','Branch'],['debitAccountId','Debit A/c ID'],['name','Name of the Customer'],['productCode','Product Code'],['depositAmount','Deposit Amount'],['interestRate','Interest Rate'],['tenure','Tenure'],['maturityDate','Maturity Date'],['maturityValue','Maturity Value']]
  : [['branch','Branch'],['debitAccountId','Debit A/c ID'],['name','Name of the Customer'],['depositAmount','Deposit Amount'],['maturityDate','Maturity Date'],['maturityValue','Maturity Value'],['creditAccountId','Credit A/c ID']];

 const columns: DataTableColumn<RecordItem>[] = [
  ...visibleKeys.map(([key,label]) => ({ key, label, minWidth: 25, render: (record: RecordItem) => record.fields[key] || (key === 'branch' ? 'Main Branch' : '—') })),
  { key: 'id', label: 'Request ID', minWidth: 50, nowrap: true, render: (record) => record.displayId ?? record.id },
  { key: 'status', label: 'Status', minWidth: 25, nowrap: true, render: (record) => <Chip size="small" label={isPending(record) ? 'Pending for Authorisation' : record.status} color={isPending(record) ? 'warning' : record.status === 'Rejected' ? 'error' : 'success'} variant="outlined" /> },
  { key: 'actions', label: 'Actions', minWidth: 220, nowrap: true, render: (record) => isPending(record) ? <Button size="small" color="success" variant="contained" onClick={() => void openSelected(record)}>Verify</Button> : <Stack direction="row" spacing={0.25}><Button size="small" disabled={record.status === 'Rejected'} onClick={() => void openView(record)}>View</Button></Stack> },
 ];

 return <Box>
  <PageHeader title={config.title} subtitle={`Manage ${config.product==='BOTH'?'fixed and recurring deposit':config.product==='FD'?'fixed deposit':'recurring deposit'} account ${config.mode==='opening'?'opening':'closing'} requests.`} />
  {store.error&&<Alert sx={{mb:2}} severity="error">{store.error}</Alert>}
  {feedback&&<Alert sx={{mb:2}} onClose={()=>setFeedback('')} severity={feedback.startsWith('Please')?'warning':'success'}>{feedback}</Alert>}

  <Paper variant="outlined" sx={{borderRadius:3,overflow:'hidden'}}>
   <Stack direction={{xs:'column',sm:'row'}} spacing={1} sx={{p:2}}>
    <TextField size="small" fullWidth label="Search requests" value={search} onChange={e=>setSearch(e.target.value)}/>
    <TextField select size="small" label="Product" value={config.product} disabled sx={{minWidth:140}}>
      <MenuItem value="FD">FD</MenuItem><MenuItem value="RD">RD</MenuItem><MenuItem value="BOTH">FD / RD</MenuItem>
    </TextField>
   </Stack>
   <Stack direction={{xs:'column',md:'row'}} spacing={1} sx={{px:2,pb:2,borderBottom:1,borderColor:'divider'}}>
    <Button size="small" variant={tab==='view'?'contained':'outlined'} onClick={()=>setTab('view')}>View</Button>
    <Button size="small" variant={tab==='pending'?'contained':'outlined'} onClick={()=>setTab('pending')}>Pending for Authorisation ({rows.filter(isPending).length})</Button>
    <Box sx={{flex:1}}/>
   </Stack>
   <DataTable rows={filtered} columns={columns} getRowId={(record) => record.id} emptyMessage={store.loading?'Loading requests…':'No deposit requests found.'}/>
   <Stack direction="row" justifyContent="space-between" sx={{p:2}}>
    <Typography variant="caption">Showing {filtered.length} of {rows.length} requests</Typography>
    <Typography variant="caption">Pending: {rows.filter(isPending).length}</Typography>
   </Stack>
  </Paper>

  <Dialog open={formOpen} onClose={()=>setFormOpen(false)} fullWidth maxWidth="md">
   <DialogTitle>{config.mode==='opening'?'Open RD / FD Account':'Close RD / FD Account'}</DialogTitle>
   <DialogContent dividers>
    <Alert severity="info" sx={{mb:2}}>Enter the account details below. Fields marked * are required.</Alert>
    <Box sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr'},gap:2,pt:1}}>
     {fields.map(([key,label])=>{
       const required=(config.mode==='opening'?['debitAccountId','productCode','depositAmount','tenure']:['debitAccountId','creditAccountId']).includes(key);
       const systemKeys=config.mode==='opening'?['accountStatus','availableBalance','customerNo','name']:['debitStatus','name','creditStatus','creditName'];
       const lockedKeys=config.mode==='opening'?['debitAccountId']:['creditAccountId'];
       const readOnly=systemKeys.includes(key)||(Boolean(editing)&&lockedKeys.includes(key));
       if(['autoRenewal','renewWithInterest'].includes(key))return <TextField key={key} select disabled={readOnly} label={label} value={values[key]||'No'} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))}><MenuItem value="Yes">Yes</MenuItem><MenuItem value="No">No</MenuItem></TextField>;
       return <TextField key={key} label={label} required={required} disabled={readOnly} type={['certificateDate','asOfDate','maturityDate'].includes(key)?'date':['depositAmount','interestRate','offsetRate','tenure','maturityValue'].includes(key)?'number':'text'} inputProps={['depositAmount','interestRate','offsetRate','tenure','maturityValue'].includes(key)?{min:0,step:'any'}:undefined} error={Boolean(fieldErrors[key])} helperText={fieldErrors[key]||' '} InputLabelProps={['certificateDate','asOfDate','maturityDate'].includes(key)?{shrink:true}:undefined} value={values[key]||''} onChange={e=>{setValues(v=>({...v,[key]:e.target.value}));setFieldErrors(old=>({...old,[key]:''}));}} InputProps={['productCode','schemeCode'].includes(key)?{endAdornment:<Button size="small" onClick={()=>setValues(v=>({...v,[key]:key==='productCode'?'FD-01':'STANDARD-12M'}))}>Lookup</Button>}:undefined}/>;
     })}
    </Box>
   </DialogContent>
   <DialogActions><Button size="small" onClick={()=>setFormOpen(false)}>Cancel</Button><Button size="small" variant="contained" onClick={submit}>Submit</Button></DialogActions>
  </Dialog>

  {/* Verify dialog: same sectioned/readable pattern as the generic request modules. */}
  <Dialog open={!!selected} onClose={()=>setSelected(null)} fullWidth maxWidth="lg">
   <DialogTitle sx={{fontWeight:800,pb:1}}>
    Verify Request — {selected?.displayId??selected?.id}
   </DialogTitle>
   <DialogContent dividers sx={{p:2}}>
    {selected&&<>
      <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2,mb:2,p:1.5,borderRadius:2,bgcolor:'action.hover'}}>
       <Typography variant="subtitle2" sx={{fontWeight:800}}>Request Details</Typography>
       <Stack direction="row" spacing={1}>
        <Chip size="small" variant="outlined" label={selected.fields.status || selected.status || '—'}/>
        <Chip size="small" label="Pending for Authorisation" color="warning"/>
       </Stack>
      </Box>
      <Box sx={{border:'1px solid',borderColor:'divider',borderRadius:2,overflow:'hidden'}}>
       <Box sx={{px:1.5,py:1,bgcolor:'action.hover'}}>
        <Typography variant="subtitle2" sx={{fontWeight:800}}>{config.mode==='opening'?'FD / RD Opening Details':'FD / RD Closing Details'}</Typography>
       </Box>
       <Box sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'repeat(2,minmax(0,1fr))',md:'repeat(3,minmax(0,1fr))'},p:1.25}}>
        {visibleKeys.map(([key,label])=><Box key={key} sx={{p:1,minWidth:0}}>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{fontWeight:600,mt:.25,overflowWrap:'anywhere'}}>{selected.fields[key] || (key==='branch'?'Main Branch':'—')}</Typography>
        </Box>)}
       </Box>
      </Box>
    </>}
   </DialogContent>
   <DialogActions sx={{px:2,py:1.5}}>
    <Button size="small" onClick={()=>setSelected(null)}>Close</Button>
    {<>
      <Button size="small" color="error" variant="outlined" onClick={()=>requestDecision('Rejected')}>Reject</Button>
      <Button size="small" color="success" variant="contained" onClick={()=>requestDecision('Authorised')}>Verify</Button>
    </>}
   </DialogActions>
  </Dialog>

  {/* View dialog: ONLY the fields that are actually present in the grid. */}
  <Dialog open={!!view} onClose={()=>setView(null)} fullWidth maxWidth="lg">
   <DialogTitle sx={{fontWeight:800,pb:1}}>
    View Request — {view?.displayId??view?.id}
   </DialogTitle>
   <DialogContent dividers sx={{p:2}}>
    {view&&<>
      <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2,mb:2,p:1.5,borderRadius:2,bgcolor:'action.hover'}}>
       <Typography variant="subtitle2" sx={{fontWeight:800}}>Request Details</Typography>
       <Chip size="small" label={view.status || '—'} color={view.status==='Rejected'?'error':'success'} variant="outlined"/>
      </Box>
      <Box sx={{border:'1px solid',borderColor:'divider',borderRadius:2,overflow:'hidden'}}>
       <Box sx={{px:1.5,py:1,bgcolor:'action.hover'}}>
        <Typography variant="subtitle2" sx={{fontWeight:800}}>{config.mode==='opening'?'FD / RD Opening Details':'FD / RD Closing Details'}</Typography>
       </Box>
       <Box sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'repeat(2,minmax(0,1fr))',md:'repeat(3,minmax(0,1fr))'},p:1.25}}>
        {visibleKeys.map(([key,label])=><Box key={key} sx={{p:1,minWidth:0}}>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{fontWeight:600,mt:.25,overflowWrap:'anywhere'}}>{view.fields[key] || (key==='branch'?'Main Branch':'—')}</Typography>
        </Box>)}
       </Box>
      </Box>
    </>}
   </DialogContent>
   <DialogActions sx={{px:2,py:1.5}}><Button size="small" onClick={()=>setView(null)}>Close</Button></DialogActions>
  </Dialog>

  <ConfirmDialog
    open={decisionConfirm!==null}
    title={decisionConfirm==='Rejected'?'Confirm Rejection':'Confirm Verification'}
    message={decisionConfirm==='Rejected'?'Are you sure you want to reject this request?':'Are you sure you want to verify this request?'}
    confirmText={decisionConfirm==='Rejected'?'Reject':'Verify'}
    variant={decisionConfirm==='Rejected'?'danger':'warning'}
    onCancel={()=>setDecisionConfirm(null)}
    onConfirm={()=>decisionConfirm&&void verify(decisionConfirm)}
  />
  <ConfirmDialog open={confirm} title="Confirm request" message={`Confirm ${editing?'updating':'submitting'} this ${config.mode==='opening'?'account opening':'account closing'} request?`} onCancel={()=>setConfirm(false)} onConfirm={()=>void commit()}/>
 </Box>
}
