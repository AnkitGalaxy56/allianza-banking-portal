import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, Paper, Snackbar, Stack, TextField, Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';

type Bank = {
  id: string; code: string; name: string; type: string; sponsorBank: string;
  pan: string; cutOffTimings: string; branches: string; address: string;
  address1: string; address2: string; address3: string; city: string; state: string;
  pincode: string; sponsorAccountId: string; registrationLicense: string;
  ifsc: string; gst: string; workingFrom: string; workingTo: string; micr: string;
};
type BankForm = Omit<Bank, 'id'>;
const emptyForm: BankForm = {
  code: '', name: '', type: '', sponsorBank: '', pan: '', cutOffTimings: '', branches: '',
  address: '', address1: '', address2: '', address3: '', city: '', state: '', pincode: '',
  sponsorAccountId: '', registrationLicense: '', ifsc: '', gst: '', workingFrom: '', workingTo: '', micr: '',
};
const demoBanks: Bank[] = [
  { id: 'bank-001', ...emptyForm, code: 'ALZ001', name: 'Allianza Demo Bank', type: 'Co-operative', sponsorBank: 'Allianza Sponsor Bank', pan: 'ABCDE1234F', cutOffTimings: '16:00', branches: '12', address: 'Main Road, Pune', address1: 'Shivaji Nagar', address2: '', address3: '', city: 'Pune', state: 'Maharashtra', pincode: '411005', sponsorAccountId: 'SB001234', registrationLicense: 'REG-2024-001', ifsc: 'ALZN0000001', gst: '27ABCDE1234F1Z5', workingFrom: '09:30', workingTo: '17:30', micr: '411002001' },
  { id: 'bank-002', ...emptyForm, code: 'ALZ002', name: 'Sample Urban Bank', type: 'Urban Co-operative', sponsorBank: 'Allianza Sponsor Bank', pan: 'FGHIJ5678K', cutOffTimings: '15:30', branches: '8', address: 'Station Road, Nashik', address1: '', address2: '', address3: '', city: 'Nashik', state: 'Maharashtra', pincode: '422001', sponsorAccountId: 'SB009876', registrationLicense: 'REG-2024-002', ifsc: 'ALZN0000002', gst: '27FGHIJ5678K1Z5', workingFrom: '10:00', workingTo: '17:00', micr: '422002001' },
];
const fieldRows: { name: keyof BankForm; label: string; span?: number }[] = [
  { name: 'code', label: 'Bank Code' }, { name: 'name', label: 'Bank Name', span: 2 },
  { name: 'type', label: 'Bank Type' }, { name: 'registrationLicense', label: 'Registration License No.' },
  { name: 'sponsorBank', label: 'Sponsor Bank', span: 2 }, { name: 'ifsc', label: 'IFSC Code' },
  { name: 'pan', label: 'PAN No.' }, { name: 'gst', label: 'G.S.T. No.' },
  { name: 'cutOffTimings', label: 'Cut off timings' }, { name: 'micr', label: 'MICR Code' },
  { name: 'branches', label: 'No. of Branches' }, { name: 'address', label: 'Address' },
  { name: 'address1', label: 'Address1' }, { name: 'address2', label: 'Address2' },
  { name: 'address3', label: 'Address3' }, { name: 'city', label: 'City' },
  { name: 'state', label: 'State' }, { name: 'pincode', label: 'Pincode' },
  { name: 'sponsorAccountId', label: 'Sponsor Bank A/c ID', span: 2 },
];

export default function BankPage() {
  const [banks, setBanks] = useState<Bank[]>(demoBanks);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Bank | null>(null);
  const [form, setForm] = useState<BankForm>(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const rows = useMemo(() => banks.filter((bank) =>
    `${bank.code} ${bank.name} ${bank.type} ${bank.city} ${bank.ifsc}`.toLowerCase().includes(search.toLowerCase().trim())), [banks, search]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setDialogOpen(true); };
  const openEdit = (bank: Bank) => {
    setEditing(bank);
    const { id: _id, ...values } = bank;
    setForm(values);
    setError('');
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditing(null); setError(''); };
  const updateField = (key: keyof BankForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const saveBank = () => {
    if (!form.code.trim() || !form.name.trim()) { setError('Bank Code and Bank Name are required.'); return; }
    if (banks.some((bank) => bank.code.toLowerCase() === form.code.trim().toLowerCase() && bank.id !== editing?.id)) {
      setError('A bank with this code already exists.'); return;
    }
    if (editing) {
      setBanks((current) => current.map((bank) => bank.id === editing.id ? { ...form, id: editing.id } : bank));
      setMessage('Bank updated successfully.');
    } else {
      setBanks((current) => [...current, { ...form, id: `bank-${Date.now()}` }]);
      setMessage('Bank added successfully.');
    }
    closeDialog();
  };

  const columns = useMemo<DataTableColumn<Bank>[]>(() => [
    { key: 'code', label: 'Bank Code', minWidth: 110, render: (bank) => <Typography fontWeight={700} fontSize={13}>{bank.code}</Typography> },
    { key: 'name', label: 'Bank Name', minWidth: 200, render: (bank) => <Stack direction="row" alignItems="center" spacing={1.25}><Box sx={{ width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 1.5, bgcolor: 'primary.light', color: 'primary.dark' }}><AccountBalanceOutlinedIcon fontSize="small" /></Box><Box><Typography fontWeight={700} fontSize={13}>{bank.name}</Typography><Typography variant="caption" color="text.secondary">{bank.type || 'Bank'}</Typography></Box></Stack> },
    { key: 'sponsor', label: 'Sponsor Bank', minWidth: 160, render: (bank) => bank.sponsorBank || '—' },
    { key: 'ifsc', label: 'IFSC Code', minWidth: 130, render: (bank) => bank.ifsc || '—' },
    { key: 'city', label: 'City', minWidth: 100, render: (bank) => bank.city || '—' },
    { key: 'branches', label: 'Branches', align: 'center', render: (bank) => bank.branches || '—' },
    { key: 'actions', label: 'Actions', align: 'right', minWidth: 100, nowrap: true, render: (bank) => <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => openEdit(bank)}>Edit</Button> },
  ], [banks]);

  return <Box>
    <PageHeader title="Bank Management" subtitle="Create, view and maintain bank master details" actions={<Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openAdd}>Add Bank</Button>} />
    <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box><Typography variant="h6" fontWeight={800}>Bank Master</Typography><Typography variant="body2" color="text.secondary">{banks.length} bank record{banks.length === 1 ? '' : 's'} configured</Typography></Box>
        <TextField size="small" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bank, code, IFSC or city" sx={{ width: { xs: '100%', sm: 320 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
      </Box>
      <DataTable rows={rows} columns={columns} getRowId={(bank) => bank.id} emptyMessage="No banks found. Add a bank to get started." />
      <Box sx={{ px: 2.5, py: 1.75, borderTop: 1, borderColor: 'divider' }}><Typography variant="body2" color="text.secondary">Showing {rows.length} of {banks.length} banks</Typography></Box>
    </Paper>

    <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}>
        <Box><Typography variant="h6" fontWeight={800}>{editing ? 'Edit Bank' : 'Bank Master'}</Typography><Typography variant="body2" color="text.secondary">{editing ? 'Update the selected bank details' : 'Enter details to register a bank'}</Typography></Box>
        <IconButton aria-label="Close" onClick={closeDialog}><CloseOutlinedIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2, pt: 0.5 }}>
          {fieldRows.map((field) => <TextField key={field.name} label={field.label} size="small" value={form[field.name]} onChange={(event) => updateField(field.name, event.target.value)} required={field.name === 'code' || field.name === 'name'} sx={{ gridColumn: { xs: 'auto', sm: field.span === 2 ? 'span 2' : 'span 1' } }} />)}
          <Box sx={{ gridColumn: { xs: 'auto', sm: 'span 2' }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Working Timings From" size="small" type="time" value={form.workingFrom} onChange={(event) => updateField('workingFrom', event.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Working Timings To" size="small" type="time" value={form.workingTo} onChange={(event) => updateField('workingTo', event.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}><Button onClick={closeDialog} color="inherit" variant="outlined">Cancel</Button><Button onClick={saveBank} variant="contained">{editing ? 'Save Changes' : 'Submit'}</Button></DialogActions>
    </Dialog>
    <Snackbar open={Boolean(message)} autoHideDuration={3500} onClose={() => setMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity="success" variant="filled" onClose={() => setMessage('')}>{message}</Alert></Snackbar>
  </Box>;
}
