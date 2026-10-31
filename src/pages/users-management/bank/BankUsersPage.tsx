import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import StatusChip from '@/components/common/StatusChip';
import ErrorState from '@/components/common/ErrorState';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAppSelector } from '@/redux/hooks';
import { selectTheme } from '@/redux/slices/themeSlice';
import { branchUserService } from '@/services/branch-user.service';
import type { BranchUser, BranchUserInput, BranchUserRole, UserAuthorizationStatus } from '@/types/branchUser';
import BranchUserFormDialog from './components/BranchUserFormDialog';
import { BRANCHES } from './data/branchUserOptions';
import {
  branchUserSchema,
  EMPTY_BRANCH_USER,
  type BranchUserFormValues,
  userToFormValues,
} from './schemas/branchUserSchema';

const PAGE_SIZE = 8;

type Feedback = { message: string; severity: 'success' | 'error' | 'info' } | null;

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export default function BankUsersPage() {
  const theme = useAppSelector(selectTheme);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('all');
  const [role, setRole] = useState<BranchUserRole | 'all'>('all');
  const [authorizationFilter, setAuthorizationFilter] = useState<UserAuthorizationStatus | 'all'>('all');
  const [readOnly, setReadOnly] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BranchUser | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, loading, error, reload } = useAsyncData(
    () =>
      branchUserService.list({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        branchId,
        role,
        authorizationStatus: authorizationFilter,
      }),
    [page, debouncedSearch, branchId, role, authorizationFilter, refreshKey],
  );

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchUserFormValues>({
    resolver: zodResolver(branchUserSchema),
    defaultValues: EMPTY_BRANCH_USER,
  });

  const openAddForm = () => {
    setEditingUser(null);
    setReadOnly(false);
    setVerifyingUser(false);
    reset(EMPTY_BRANCH_USER);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (user: BranchUser) => {
    setReadOnly(false);
    setVerifyingUser(false);
    setEditingUser(user);
    reset(userToFormValues(user));
    setFormError('');
    setFormOpen(true);
  };

  const openVerifyForm = (user: BranchUser) => {
    setEditingUser(user);
    setReadOnly(true);
    setVerifyingUser(true);
    reset(userToFormValues(user));
    setFormError('');
    setFormOpen(true);
  };

  const openViewForm = (user: BranchUser) => {
    setEditingUser(user);
    setReadOnly(true);
    setVerifyingUser(false);
    reset(userToFormValues(user));
    setFormError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingUser(null);
    setReadOnly(false);
    setVerifyingUser(false);
    reset(EMPTY_BRANCH_USER);
    setFormError('');
  };

  const submit = async (values: BranchUserFormValues) => {
    setFormError('');
    setSaving(true);

    const name = [values.firstName, values.middleName, values.lastName]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(' ');

    const input: BranchUserInput = {
      title: values.title,
      employeeId: values.employeeId.trim(),
      firstName: values.firstName.trim(),
      middleName: values.middleName.trim(),
      lastName: values.lastName.trim(),
      name,
      mobile: values.mobile,
      email: values.email.trim(),
      userName: values.userName.trim(),
      displayName: values.displayName.trim(),
      role: values.role,
      systemRole: values.systemRole,
      branchId: values.branchId,
      multiBranchAccess: values.multiBranchAccess,
      status: editingUser ? values.status : 'Entered',
      dateOfBirth: values.dateOfBirth,
      twoFactorDesignation: values.twoFactorDesignation,
      idleTimeoutSeconds: Number(values.idleTimeoutSeconds),
      badLoginCount: Number(values.badLoginCount),
      loginTime: values.loginTime,
      logoutTime: values.logoutTime,
      inoperativeDate: values.inoperativeDate,
      twoFactorLogin: values.twoFactorLogin === 'Yes',
      authenticationType: values.authenticationType,
      accessLevel: values.accessLevel,
      sendLoginEmail: values.sendLoginEmail,
    };

    try {
      if (editingUser) {
        await branchUserService.update(editingUser.id, input);
        setFeedback({ message: 'User Master record updated successfully.', severity: 'success' });
      } else {
        await branchUserService.create(input);
        setFeedback({ message: 'User Master record created successfully.', severity: 'success' });
      }

      setFormOpen(false);
      setEditingUser(null);
      reset(EMPTY_BRANCH_USER);
      setRefreshKey((value) => value + 1);
      reload();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Unable to save user record.');
    } finally {
      setSaving(false);
    }
  };

  const authenticateUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await branchUserService.authorize(editingUser.id);
      setFeedback({ message: `${editingUser.name} authenticated successfully.`, severity: 'success' });
      setFormOpen(false); setEditingUser(null); setVerifyingUser(false); setReadOnly(false);
      setRefreshKey((value) => value + 1); reload();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not authenticate user.');
    } finally { setSaving(false); }
  };

  const columns: DataTableColumn<BranchUser>[] = [
    {
      key: 'employeeId',
      label: 'Emp ID',
      minWidth: 105,
      nowrap: true,
      render: (user) => <Typography variant="body2" fontWeight={700}>{user.employeeId}</Typography>,
    },
    {
      key: 'employee',
      label: 'Employee Name',
      minWidth: 225,
      render: (user) => (
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.light',
              color: 'primary.dark',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {initials(user.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={700} fontSize={13} noWrap>{[user.title, user.name].filter(Boolean).join(' ')}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
          </Box>
        </Stack>
      ),
    },
    { key: 'userName', label: 'User Name', minWidth: 125, render: (user) => user.userName },
    { key: 'mobile', label: 'Mobile', minWidth: 115, nowrap: true, render: (user) => user.mobile },
    { key: 'branch', label: 'Branch', minWidth: 130, render: (user) => user.branchName },
    { key: 'userRole', label: 'User Role', minWidth: 105, render: (user) => user.role },
    { key: 'systemRole', label: 'System Role', minWidth: 155, render: (user) => user.systemRole },
    { key: 'status', label: 'Status', minWidth: 100, render: (user) => <StatusChip status={user.status.toLowerCase()} /> },
    { key: 'loginTime', label: 'Login Time', minWidth: 100, nowrap: true, render: (user) => user.loginTime || '—' },
    { key: 'logoutTime', label: 'Logout Time', minWidth: 105, nowrap: true, render: (user) => user.logoutTime || '—' },
    {
      key: 'actions',
      label: 'Actions',
      minWidth: 220,
      nowrap: true,
      render: (user) => (
        <Stack direction="row" spacing={0.25}>
          <Button size="small" disabled={user.status === 'Entered'} onClick={() => openViewForm(user)}>View</Button>
          <Button size="small" disabled={user.status === 'Entered'} startIcon={<EditOutlinedIcon />} onClick={() => openEditForm(user)}>Edit</Button>
          {user.status === 'Entered' && (
            <Button size="small" color="success" startIcon={<CheckCircleOutlineOutlinedIcon />} onClick={() => openVerifyForm(user)}>Verify</Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      {/* <PageHeader
        title="Branch Users"
        subtitle="Manage bank employees, system roles and access permissions"
        actions={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openAddForm}>
            Add branch user
          </Button>
        }
      /> */}
      <PageHeader
        title="User Management"
        subtitle="Manage users, system roles."
      // actions={
      //   <>
      //     <Button
      //       variant="outlined"
      //       color="inherit"
      //       size="small"
      //       startIcon={<VisibilityOutlinedIcon />}
      //       onClick={() => { setAuthorizationFilter('all'); setPage(1); }}
      //     >
      //       View
      //     </Button>

      //     <Button
      //       variant="contained"
      //       startIcon={<AddOutlinedIcon />}
      //       size="small"
      //       onClick={openAddForm}
      //     >
      //       Create New
      //     </Button>

      //     <Button
      //       variant="outlined"
      //       color="inherit"
      //       size="small"
      //       startIcon={<PendingActionsOutlinedIcon />}
      //       onClick={() => { setAuthorizationFilter('Pending'); setPage(1); }}
      //     >
      //       Pending for Authorisation
      //     </Button>
      //   </>
      // }
      />
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', p: 2.5 }}>

          <TextField
            size="small"
            placeholder="Search by Emp ID, name, username, email or mobile"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            sx={{ flex: '1 1 320px' }}
            InputProps={{
              startAdornment: <SearchOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />,
            }}
          />
          <TextField
          <TextField
            select
            size="small"
            label="Branch filter"
            value={branchId}
            onChange={(event) => {
              setBranchId(event.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 155 }}
          >
            <MenuItem value="all">All branches</MenuItem>
            {BRANCHES.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="User role filter"
            value={role}
            onChange={(event) => {
              setRole(event.target.value as BranchUserRole | 'all');
              setPage(1);
            }}
            sx={{ minWidth: 145 }}
          >
            <MenuItem value="all">All user roles</MenuItem>
            <MenuItem value="Bank User">Bank User</MenuItem>
            <MenuItem value="Admin User">Admin User</MenuItem>
          </TextField>
          </TextField>
        </Box>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => { setAuthorizationFilter('all'); setPage(1); }}
          >
            View
          </Button>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            size="small"
            onClick={openAddForm}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<PendingActionsOutlinedIcon />}
            onClick={() => { setAuthorizationFilter('Pending'); setPage(1); }}
          >
            Pending for Authorisation
          </Button>
        </Stack>

        {error && <Box sx={{ px: 2.5, pb: 2 }}><ErrorState message={error} onRetry={reload} /></Box>}
        <Box sx={{ opacity: loading ? 0.55 : 1, transition: 'opacity .2s' }}>
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={(user) => user.id}
            emptyMessage="No user records match your search." />
        </Box>

        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {from}–{to} of {total} users
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="inherit" size="small" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </Button>
            <Button variant="outlined" color="inherit" size="small" disabled={to >= total} onClick={() => setPage((current) => current + 1)}>
              Next
            </Button>
          </Stack>
        </Box>
      </Paper>

      <BranchUserFormDialog
        open={formOpen}
        onClose={closeForm}
        editingUser={editingUser}
        formError={formError}
        saving={saving}
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={submit}
        themeName={theme.name}
        readOnly={readOnly}
        verifying={verifyingUser}
        onAuthenticate={() => void authenticateUser()}
      />

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={3500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} variant="filled" onClose={() => setFeedback(null)} sx={{ width: '100%' }}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
