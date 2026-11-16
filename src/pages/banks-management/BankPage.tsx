import { useEffect, useMemo, useState } from 'react';
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
import axios from 'axios';
import { getErrorMessage } from '@/services/api/apiError';
import { mastersService } from '@/services/masters.service';
import { emptyForm } from './data/banksDemo';
import { bankFieldRows as fieldRows } from './components/BankFormFields';
import { bankSchema } from './schemas/bankSchema';

import type { Bank, BankForm } from './types/bank';




export default function BankPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const loadBanks = async () => {
    try {
      const result = await mastersService.listBanks({ page: 1, pageSize: 200 });
      setBanks(result.items);
      setLoadError('');
    } catch (e) {
      setLoadError(getErrorMessage(e, 'Unable to load banks.'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void loadBanks(); }, []);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Bank | null>(null);
  const [form, setForm] = useState<BankForm>(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const rows = useMemo(() => banks.filter((bank) =>
    `${bank.code} ${bank.name} ${bank.type} ${bank.city} ${bank.ifsc}`.toLowerCase().includes(search.toLowerCase().trim())), [banks, search]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setFieldErrors({}); setDialogOpen(true); };
  const openEdit = (bank: Bank) => {
    setEditing(bank);
    const { id: _id, ...values } = bank;
    setForm(values);
    setError('');
    setFieldErrors({});
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditing(null); setError(''); setFieldErrors({}); };
  const updateField = (key: keyof BankForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const saveBank = async () => {
    const parsed = bankSchema.safeParse(form);
    if (!parsed.success) { setFieldErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]))); setError('Please correct the highlighted fields before saving.'); return; }
    setFieldErrors({});
    setError('');
    setSaving(true);
    try {
      if (editing) {
        await mastersService.updateBank(editing.id, form);
        setMessage('Bank updated successfully.');
      } else {
        await mastersService.createBank(form);
        setMessage('Bank added successfully.');
      }
      closeDialog();
      await loadBanks();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errors = (e.response?.data as { errors?: Record<string, string> } | undefined)?.errors;
        if (errors) setFieldErrors(errors);
      }
      setError(getErrorMessage(e, 'Unable to save the bank.'));
    } finally {
      setSaving(false);
    }
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
    <PageHeader title="Bank Management" subtitle="Create, view and maintain bank master details" />
    {loadError && <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={() => void loadBanks()}>Retry</Button>}>{loadError}</Alert>}
    <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box><Typography variant="body2" color="text.secondary">{banks.length} bank record{banks.length === 1 ? '' : 's'} configured</Typography></Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField size="small" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bank, code, IFSC or city" sx={{ width: { xs: '100%', sm: 320 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }} />
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openAdd}>Add Bank</Button>
        </Stack>
      </Box>
      <DataTable rows={rows} columns={columns} getRowId={(bank) => bank.id} emptyMessage={loading ? 'Loading banks…' : 'No banks found. Add a bank to get started.'} />
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
          {fieldRows.map((field) => <TextField key={field.name} label={field.label} size="small" value={form[field.name]} error={Boolean(fieldErrors[field.name])} helperText={fieldErrors[field.name] || ' '} onChange={(event) => { updateField(field.name, event.target.value); setFieldErrors((old) => ({ ...old, [field.name]: '' })); }} required={field.name === 'code' || field.name === 'name'} disabled={(Boolean(editing) && field.name === 'code') || field.name === 'branches'} sx={{ gridColumn: { xs: 'auto', sm: field.span === 2 ? 'span 2' : 'span 1' } }} />)}
          <Box sx={{ gridColumn: { xs: 'auto', sm: 'span 2' }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Working Timings From" size="small" type="time" value={form.workingFrom} error={Boolean(fieldErrors.workingFrom)} helperText={fieldErrors.workingFrom || ' '} onChange={(event) => updateField('workingFrom', event.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Working Timings To" size="small" type="time" value={form.workingTo} error={Boolean(fieldErrors.workingTo)} helperText={fieldErrors.workingTo || ' '} onChange={(event) => { updateField('workingTo', event.target.value); setFieldErrors((old) => ({ ...old, workingTo: '' })); }} InputLabelProps={{ shrink: true }} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}><Button onClick={closeDialog} color="inherit" variant="outlined">Cancel</Button><Button onClick={() => void saveBank()} variant="contained" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Submit'}</Button></DialogActions>
    </Dialog>
    <Snackbar open={Boolean(message)} autoHideDuration={3500} onClose={() => setMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity="success" variant="filled" onClose={() => setMessage('')}>{message}</Alert></Snackbar>
  </Box>;
}
