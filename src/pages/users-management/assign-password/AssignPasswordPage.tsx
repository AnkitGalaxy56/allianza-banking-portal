import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PageHeader from '@/components/common/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { branchUserService } from '@/services/branch-user.service';
import { assignPasswordService } from '@/services/assign-password.service';
import type { BranchUser } from '@/types/branchUser';

type Feedback = { severity: 'success' | 'error'; message: string } | null;

const PAGE_SIZE = 100;

export default function AssignPasswordPage() {
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState<BranchUser | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [formError, setFormError] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, loading, error, reload } = useAsyncData(
    () => branchUserService.list({
      page: 1,
      pageSize: PAGE_SIZE,
      search: debouncedSearch,
      authorizationStatus: 'Authorized',
    }),
    [debouncedSearch, refreshKey],
  );

  const users = useMemo(
    () => (data?.items ?? []).filter((user) => user.status === 'Operative'),
    [data],
  );

  const closeDialog = () => {
    if (saving) return;
    setSelectedUser(null);
    setPassword('');
    setConfirmPassword('');
    setFormError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const openDialog = (user: BranchUser) => {
    setSelectedUser(user);
    setPassword('');
    setConfirmPassword('');
    setFormError('');
    setFeedback(null);
  };

  const submit = async () => {
    setFormError('');
    if (!selectedUser) return;
    if (password.length < 8) {
      setFormError('Password must contain at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setFormError('Use at least one uppercase letter, one lowercase letter and one number.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Password and confirm password do not match.');
      return;
    }

    setSaving(true);
    try {
      await assignPasswordService.assign(selectedUser.id, password);
      setFeedback({ severity: 'success', message: `Password assigned successfully for ${selectedUser.name}.` });
      setSelectedUser(null);
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setRefreshKey((value) => value + 1);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to assign password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Assign Password"
        subtitle="Set or reset login passwords for authorised and operative bank users."
      />

      {feedback && (
        <Alert severity={feedback.severity} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee ID, name, username or branch"
            sx={{ flex: '1 1 320px' }}
            InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" /> }}
          />
          <Chip label={`${users.length} eligible users`} variant="outlined" />
        </Box>

        {error && <Alert severity="error" sx={{ mx: 2, mb: 2 }}>{String(error)}</Alert>}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                {['Employee ID', 'Employee Name', 'Username', 'Branch', 'User Role', 'Status', 'Action'].map((label) => (
                  <TableCell key={label} sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">No authorised and operative users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow hover key={user.id}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.employeeId}</TableCell>
                  <TableCell>
                    <Typography fontWeight={700} variant="body2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.branchName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell><Chip size="small" color="success" variant="outlined" label="Operative" /></TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" startIcon={<KeyOutlinedIcon />} onClick={() => openDialog(user)}>
                      Assign Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>Loading users…</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ px: 2.5, py: 1.75, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Only users with Authorized status and Operative account status are eligible for password assignment.
          </Typography>
        </Box>
      </Paper>

      <Dialog open={Boolean(selectedUser)} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <LockResetOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={800}>Assign Password</Typography>
              <Typography variant="caption" color="text.secondary">Set login credentials for selected user</Typography>
            </Box>
          </Stack>
          <IconButton onClick={closeDialog} disabled={saving} size="small"><CloseOutlinedIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Paper variant="outlined" sx={{ p: 1.75, mb: 2, borderRadius: 2 }}>
              <Typography fontWeight={700}>{selectedUser.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.employeeId} · {selectedUser.userName} · {selectedUser.branchName}
              </Typography>
            </Paper>
          )}
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Stack spacing={2}>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete="new-password"
              helperText="Minimum 8 characters; include uppercase, lowercase and a number."
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((value) => !value)} edge="end">
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>,
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
              autoComplete="new-password"
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((value) => !value)} edge="end">
                    {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button color="inherit" variant="outlined" onClick={closeDialog} disabled={saving}>Cancel</Button>
          <Button variant="contained" startIcon={<KeyOutlinedIcon />} onClick={submit} disabled={saving || !password || !confirmPassword}>
            {saving ? 'Assigning…' : 'Assign Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
