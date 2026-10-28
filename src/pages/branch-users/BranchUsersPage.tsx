import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import StatusChip from '@/components/common/StatusChip';
import ErrorState from '@/components/common/ErrorState';
import FormTextField from '@/components/form/FormTextField';
import FormSelectField, { type SelectOption } from '@/components/form/FormSelectField';
import FormLookupField from '@/components/form/FormLookupField';
import FormMultiLookupField from '@/components/form/FormMultiLookupField';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { branchUserService } from '@/services/branch-user.service';
import type { BranchUser, BranchUserInput, BranchUserRole } from '@/types/branchUser';
import { useAppSelector } from '@/redux/hooks';
import { selectTheme } from '@/redux/slices/themeSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import {
  branchUserSchema,
  EMPTY_BRANCH_USER,
  type BranchUserFormValues,
  userToFormValues,
} from './branchUserSchema';

const PAGE_SIZE = 8;

// Demo lookup lists. Replace these static options with backend lookup APIs when available.
const BRANCHES = [
  { id: 'br-001', name: 'Main branch' },
  { id: 'br-002', name: 'Branch 2' },
  { id: 'br-003', name: 'Branch 3' },
  { id: 'br-004', name: 'Branch 4' },
  { id: 'br-005', name: 'Branch 5' },
  { id: 'br-006', name: 'Branch 6' },
  { id: 'br-007', name: 'Branch 7' },
  { id: 'br-008', name: 'Branch 8' },
];

const BRANCH_OPTIONS: SelectOption[] = BRANCHES.map((branch) => ({
  value: branch.id,
  label: branch.name,
}));

const TITLE_OPTIONS: SelectOption[] = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Ms', label: 'Ms' },
];

const USER_ROLE_OPTIONS: SelectOption[] = [
  { value: 'Manager', label: 'Manager' },
  { value: 'Officer', label: 'Officer' },
];

const SYSTEM_ROLE_OPTIONS: SelectOption[] = [
  { value: 'Branch Administrator', label: 'Branch Administrator' },
  { value: 'Branch Manager', label: 'Branch Manager' },
  { value: 'Branch Officer', label: 'Branch Officer' },
  { value: 'Auditor', label: 'Auditor' },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Invited', label: 'Invited' },
  { value: 'Locked', label: 'Locked' },
];

const TWO_FACTOR_DESIGNATION_OPTIONS: SelectOption[] = [
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'Not Applicable', label: 'Not Applicable' },
];

const TWO_FACTOR_OPTIONS: SelectOption[] = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const AUTHENTICATION_OPTIONS: SelectOption[] = [
  { value: 'Password', label: 'Password' },
  { value: 'OTP', label: 'OTP' },
  { value: 'Password + OTP', label: 'Password + OTP' },
  { value: 'Authenticator App', label: 'Authenticator App' },
];

type Feedback = { message: string; severity: 'success' | 'error' | 'info' } | null;

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

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
    () =>
      branchUserService.list({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        branchId,
        role,
      }),
    [page, debouncedSearch, branchId, role, refreshKey],
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
    reset(EMPTY_BRANCH_USER);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (user: BranchUser) => {
    setEditingUser(user);
    reset(userToFormValues(user));
    setFormError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingUser(null);
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
      status: values.status,
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

  const resetUserLogin = async (user: BranchUser) => {
    try {
      // The current service exposes status update only; keep its existing reset behavior.
      await branchUserService.updateStatus(user.id, 'Active');
      setFeedback({ message: `Login reset requested for ${user.name}.`, severity: 'success' });
      setRefreshKey((value) => value + 1);
      reload();
    } catch (e) {
      setFeedback({
        message: e instanceof Error ? e.message : 'Could not reset user.',
        severity: 'error',
      });
    }
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
      minWidth: 125,
      nowrap: true,
      render: (user) => (
        <Stack direction="row" spacing={0.5}>
          <Button size="small" onClick={() => openEditForm(user)}>Edit</Button>
          <Button size="small" onClick={() => void resetUserLogin(user)}>Reset</Button>
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
        actions={
          <>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => {
                // TODO: Implement View functionality.
              }}
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
              onClick={() => {
                // TODO: Implement Pending for Authorisation.
              }}
            >
              Pending for Authorisation
            </Button>
          </>
        }
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
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Officer">Officer</MenuItem>
          </TextField>
        </Box>

        {error && <Box sx={{ px: 2.5, pb: 2 }}><ErrorState message={error} onRetry={reload} /></Box>}
        <Box sx={{ opacity: loading ? 0.55 : 1, transition: 'opacity .2s' }}>
          <DataTable rows={rows} columns={columns} getRowId={(user) => user.id} emptyMessage="No user records match your search." />
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

      {/* User Master form opens in a responsive MUI Dialog. */}
      < Dialog open={formOpen}
        onClose={closeForm}
        fullWidth
        maxWidth="md"
        scroll="paper">
        {/* <Dialog
        open={formOpen}
        onClose={closeForm}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 3 } }}
      > */}
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, pb: 1.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {editingUser ? 'Edit User Master' : 'User Master'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editingUser ? 'Update employee details and application permissions.' : 'Create a bank user and configure their login and access.'}
            </Typography>
          </Box>
          <IconButton aria-label="Close form" onClick={closeForm} disabled={saving} size="small">
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <Divider />
        <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <Box component="form" id="branch-user-form" noValidate onSubmit={handleSubmit(submit)}>
            <Grid container spacing={2.25}>
              {/* Column 1: employee identity and login controls */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <FormTextField<BranchUserFormValues>
                    name="employeeId" control={control} label="Emp ID" placeholder="Enter employee ID" disabled={saving} size="small"
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75 }}>
                      Employee Name
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(70px, 0.85fr) repeat(3, minmax(0, 1fr))',
                        gap: 1,
                        alignItems: 'start',
                      }}
                    >
                      <FormSelectField<BranchUserFormValues>
                        name="title"
                        control={control}
                        label="Mr/Ms"
                        options={TITLE_OPTIONS}
                        disabled={saving}
                      />
                      <FormTextField<BranchUserFormValues>
                        name="firstName"
                        control={control}
                        label="First name"
                        placeholder="First"
                        disabled={saving}
                        size="small"
                        showLabel={false}
                      />
                      <FormTextField<BranchUserFormValues>
                        name="middleName"
                        control={control}
                        label="Middle name"
                        placeholder="Middle"
                        disabled={saving}
                        size="small"
                        showLabel={false}
                      />
                      <FormTextField<BranchUserFormValues>
                        name="lastName"
                        control={control}
                        label="Last name"
                        placeholder="Last"
                        disabled={saving}
                        size="small"
                        showLabel={false}
                      />
                    </Box>
                  </Box>

                  <FormTextField<BranchUserFormValues>
                    name="mobile" control={control} label="Mobile" placeholder="10-digit mobile number" type="tel" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="userName" control={control} label="User Name" placeholder="Enter username" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="role" control={control} label="User Role" options={USER_ROLE_OPTIONS} disabled={saving}
                  />
                  <FormMultiLookupField<BranchUserFormValues>
                    name="multiBranchAccess" control={control} label="Multi Branch Access" options={BRANCH_OPTIONS} disabled={saving}
                  />
                  <FormTextField<BranchUserFormValues>
                    name="loginTime" control={control} label="LogIn Time" type="time" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="twoFactorLogin" control={control} label="2FA Login" options={TWO_FACTOR_OPTIONS} disabled={saving}
                  />
                </Stack>
              </Grid>

              {/* Column 2: contact, display and security settings */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <FormTextField<BranchUserFormValues>
                    name="email" control={control} label="Email ID" placeholder="name@bank.example" type="email" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="displayName" control={control} label="Display Name" placeholder="Name shown in the portal" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="systemRole" control={control} label="System Role" options={SYSTEM_ROLE_OPTIONS} disabled={saving}
                  />
                  <FormTextField<BranchUserFormValues>
                    name="idleTimeoutSeconds" control={control} label="Idle Timeout In Secs" type="number" placeholder="300" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="logoutTime" control={control} label="LogOut Time" type="time" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="authenticationType" control={control} label="Authentication Type" options={AUTHENTICATION_OPTIONS} disabled={saving}
                  />
                </Stack>
              </Grid>

              {/* Column 3: status, branch and audit settings */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <FormSelectField<BranchUserFormValues>
                    name="status" control={control} label="Status" options={STATUS_OPTIONS} disabled={saving} labelAbove
                  />
                  <FormTextField<BranchUserFormValues>
                    name="dateOfBirth" control={control} label="Date of Birth" type="date" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="twoFactorDesignation" control={control} label="2FA Login Designation" options={TWO_FACTOR_DESIGNATION_OPTIONS} disabled={saving}
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="branchId" control={control} label="Branch" options={BRANCH_OPTIONS} disabled={saving}
                  />
                  <FormTextField<BranchUserFormValues>
                    name="badLoginCount" control={control} label="No. of Bad Login" type="number" placeholder="0" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="inoperativeDate" control={control} label="In-Operative Date" type="date" disabled={saving} size="small"
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                Menu / Function Access Level
              </Typography>
              <Grid container spacing={1}>
                {([
                  ['create', 'Create'],
                  ['modify', 'Modify'],
                  ['view', 'View'],
                  ['authorise', 'Authorise'],
                ] as const).map(([fieldName, label]) => (
                  <Grid item xs={6} sm={3} key={fieldName}>
                    <Controller
                      name={`accessLevel.${fieldName}`}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(field.value)}
                              onChange={(_event, checked) => field.onChange(checked)}
                              disabled={saving}
                            />
                          }
                          label={label}
                        />
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <FormControlLabel
              sx={{ mt: 1.25 }}
              control={
                <Controller
                  name="sendLoginEmail"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={Boolean(field.value)}
                      onChange={(_event, checked) => field.onChange(checked)}
                      disabled={saving || Boolean(editingUser)}
                    />
                  )}
                />
              }
              label={<Typography variant="body2">Send login details by email</Typography>}
            />
            {Object.keys(errors).length > 0 && (
              <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                Please correct the highlighted fields before saving.
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Bank theme: {theme.name}. Lookup options are demonstration values until connected to backend master data.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button variant="outlined" color="inherit" onClick={closeForm} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="branch-user-form"
            variant="contained"
            disabled={saving}
            startIcon={editingUser ? undefined : <AddOutlinedIcon />}
          >
            {saving ? 'Saving…' : editingUser ? 'Save changes' : 'Save user'}
          </Button>
        </DialogActions>
      </Dialog>

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
