import { useMemo, useState } from 'react';
import { Alert, Avatar, Box, Button, Checkbox, FormControlLabel, MenuItem, Paper, Snackbar, Stack, TextField, Typography, IconButton } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import StatusChip from '@/components/common/StatusChip';
import ErrorState from '@/components/common/ErrorState';
import FormTextField from '@/components/form/FormTextField';
import FormSelectField from '@/components/form/FormSelectField';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { branchUserService } from '@/services/branch-user.service';
import type { BranchUser, BranchUserInput, BranchUserRole } from '@/types/branchUser';
import { useAppSelector } from '@/redux/hooks';
import { selectTheme } from '@/redux/slices/themeSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { branchUserSchema, EMPTY_BRANCH_USER, type BranchUserFormValues } from './branchUserSchema';

const PAGE_SIZE = 8;
const BRANCHES = [
  { id: 'br-001', name: 'Main branch' }, { id: 'br-002', name: 'Branch 2' },
  { id: 'br-003', name: 'Branch 3' }, { id: 'br-004', name: 'Branch 4' },
  { id: 'br-005', name: 'Branch 5' }, { id: 'br-006', name: 'Branch 6' },
  { id: 'br-007', name: 'Branch 7' }, { id: 'br-008', name: 'Branch 8' },
];
type Feedback = { message: string; severity: 'success' | 'error' | 'info' } | null;

export default function BranchUsersPage() {
  const theme = useAppSelector(selectTheme);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('all');
  const [role, setRole] = useState<BranchUserRole | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BranchUser | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, loading, error, reload } = useAsyncData(
    () => branchUserService.list({ page, pageSize: PAGE_SIZE, search: debouncedSearch, branchId, role }),
    [page, debouncedSearch, branchId, role, refreshKey],
  );
  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const { control, handleSubmit, reset, formState: { errors } } = useForm<BranchUserFormValues>({
    resolver: zodResolver(branchUserSchema), defaultValues: EMPTY_BRANCH_USER,
  });

  const openAddForm = () => {
    setEditingUser(null);
    reset(EMPTY_BRANCH_USER);
    setFormError('');
    setFormOpen(true);
  };
  const openEditForm = (user: BranchUser) => {
    setEditingUser(user);
    reset({ name: user.name, email: user.email, mobile: user.mobile, branchId: user.branchId, role: user.role, sendLoginEmail: false });
    setFormError('');
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingUser(null);
    reset(EMPTY_BRANCH_USER);
    setFormError('');
  };

  const columns = useMemo<DataTableColumn<BranchUser>[]>(() => [
    { key: 'user', label: 'User', minWidth: 220, render: (u) => (
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', color: 'primary.dark', fontSize: 12, fontWeight: 800 }}>
          {u.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
        </Avatar>
        <Box><Typography fontWeight={700} fontSize={13}>{u.name}</Typography><Typography variant="caption" color="text.secondary">{u.email}</Typography></Box>
      </Stack>
    ) },
    { key: 'branch', label: 'Branch', minWidth: 110, render: (u) => u.branchName },
    { key: 'role', label: 'Role', render: (u) => u.role },
    { key: 'lastLogin', label: 'Last login', minWidth: 110, render: (u) => u.lastLogin },
    { key: 'status', label: 'Status', render: (u) => <StatusChip status={u.status.toLowerCase()} /> },
    { key: 'actions', label: 'Actions', minWidth: 130, nowrap: true, render: (u) => (
      <Stack direction="row" spacing={0.5}>
        <Button size="small" onClick={() => openEditForm(u)}>Edit</Button>
        <Button size="small" onClick={async () => {
          try {
            await branchUserService.updateStatus(u.id, 'Active');
            setFeedback({ message: `Login reset requested for ${u.name}.`, severity: 'success' });
            setRefreshKey((v) => v + 1);
          } catch (e) {
            setFeedback({ message: e instanceof Error ? e.message : 'Could not reset user.', severity: 'error' });
          }
        }}>Reset</Button>
      </Stack>
    ) },
  ], []);

  const submit = async (values: BranchUserFormValues) => {
    setFormError('');
    setSaving(true);
    try {
      const input: BranchUserInput = {
        name: values.name.trim(), email: values.email.trim(), mobile: values.mobile,
        branchId: values.branchId, role: values.role, sendLoginEmail: values.sendLoginEmail,
      };
      if (editingUser) {
        await branchUserService.update(editingUser.id, input);
        setFeedback({ message: 'Branch user updated successfully.', severity: 'success' });
      } else {
        await branchUserService.create(input);
        setFeedback({ message: 'Branch user added successfully.', severity: 'success' });
      }
      closeForm();
      setRefreshKey((v) => v + 1);
      reload();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Unable to save branch user.');
    } finally { setSaving(false); }
  };

  return (
    <Box>
      <PageHeader title="Branch Users" subtitle="Staff who can sign in to the portal for your branches"
        actions={<Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openAddForm}>Add branch user</Button>} />
      <Box sx={{ display: 'grid', gridTemplateColumns: formOpen ? { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.8fr) minmax(320px, 1fr)' } : 'minmax(0, 1fr)', gap: 2.5, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', p: 2.5 }}>
            <TextField size="small" placeholder="Search by name, email or mobile" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} sx={{ flex: '1 1 220px' }} InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" /> }} />
            <TextField select size="small" label="Branch filter" value={branchId} onChange={(e) => { setBranchId(e.target.value); setPage(1); }} sx={{ minWidth: 145 }}>
              <MenuItem value="all">All branches</MenuItem>{BRANCHES.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Role filter" value={role} onChange={(e) => { setRole(e.target.value as BranchUserRole | 'all'); setPage(1); }} sx={{ minWidth: 125 }}>
              <MenuItem value="all">All roles</MenuItem><MenuItem value="Manager">Manager</MenuItem><MenuItem value="Officer">Officer</MenuItem>
            </TextField>
          </Box>
          {error && <Box sx={{ px: 2.5, pb: 2 }}><ErrorState message={error} onRetry={reload} /></Box>}
          <Box sx={{ opacity: loading ? 0.55 : 1 }}><DataTable rows={rows} columns={columns} getRowId={(u) => u.id} /></Box>
          <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">Showing {total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)} of {total} users</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="inherit" size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outlined" color="inherit" size="small" disabled={page * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </Stack>
          </Box>
        </Paper>
        {formOpen && <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Typography variant="h6" fontWeight={800}>{editingUser ? 'Edit branch user' : 'Add branch user'}</Typography>
            <IconButton aria-label="Close form" color="inherit" size="small" onClick={closeForm}><CloseOutlinedIcon fontSize="small" /></IconButton>
          </Stack>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Box component="form" noValidate onSubmit={handleSubmit(submit)}>
            <Stack spacing={2}>
              <FormTextField<BranchUserFormValues> name="name" control={control} label="Full name" placeholder="Enter full name" disabled={saving} />
              <FormTextField<BranchUserFormValues> name="email" control={control} label="Email" placeholder="name@bank.example" type="email" disabled={saving} />
              <Controller name="mobile" control={control} render={({ field, fieldState }) => (
                <TextField {...field} label="Mobile number" placeholder="10-digit number" size="small" fullWidth disabled={saving} value={field.value ?? ''} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} inputProps={{ maxLength: 10, inputMode: 'numeric' }} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))} />
              )} />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <FormSelectField<BranchUserFormValues> name="branchId" control={control} label="Branch" disabled={saving} options={BRANCHES.map((b) => ({ value: b.id, label: b.name }))} />
                <FormSelectField<BranchUserFormValues> name="role" control={control} label="Role" disabled={saving} options={[{ value: 'Manager', label: 'Manager' }, { value: 'Officer', label: 'Officer' }]} />
              </Box>
              <Controller name="sendLoginEmail" control={control} render={({ field }) => (
                <FormControlLabel control={<Checkbox checked={Boolean(field.value)} onChange={field.onChange} disabled={saving || Boolean(editingUser)} />} label={<Typography variant="body2">Send login details by email</Typography>} />
              )} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button fullWidth type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : editingUser ? 'Save changes' : 'Save user'}</Button>
                <Button fullWidth type="button" variant="outlined" color="inherit" disabled={saving} onClick={closeForm}>Cancel</Button>
              </Stack>
              {Object.keys(errors).length > 0 && <Typography variant="caption" color="text.secondary">Please correct the highlighted fields.</Typography>}
              <Typography variant="caption" color="text.secondary">Bank theme: {theme.name}. Email delivery is simulated in mock mode.</Typography>
            </Stack>
          </Box>
        </Paper>}
      </Box>
      <Snackbar open={Boolean(feedback)} autoHideDuration={3500} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {feedback ? <Alert severity={feedback.severity} variant="filled" onClose={() => setFeedback(null)} sx={{ width: '100%' }}>{feedback.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}