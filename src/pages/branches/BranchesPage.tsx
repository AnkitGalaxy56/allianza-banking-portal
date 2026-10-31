import { useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  InputAdornment, MenuItem, Paper, Select, Snackbar, Stack, TextField, Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import ErrorState from '@/components/common/ErrorState';
import StatusChip from '@/components/common/StatusChip';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { branchService } from '@/services/branch.service';
import type { Branch, BranchStatus } from './types/branch';
import { formatNumber } from '@/utils/format';
import BranchForm from './components/BranchForm';
import { BRANCH_PAGE_SIZE, BRANCH_STATUS_OPTIONS } from './data/branchMasterConfig';

export default function BranchesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BranchStatus | 'all'>('all');
  const [editing, setEditing] = useState<Branch | null>(null);
  const [viewing, setViewing] = useState<Branch | null>(null);
  const [focusSignal, setFocusSignal] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 350);
  const { data, loading, error, reload } = useAsyncData(
    () => branchService.list({ page, pageSize: BRANCH_PAGE_SIZE, search: debouncedSearch, status }),
    [page, debouncedSearch, status],
  );

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * BRANCH_PAGE_SIZE + 1;
  const to = Math.min(page * BRANCH_PAGE_SIZE, total);
  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
    setFocusSignal((value) => value + 1);
  };
  const openEdit = (branch: Branch) => {
    setEditing(branch);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const columns: DataTableColumn<Branch>[] = [
    { key: 'name', label: 'Branch', minWidth: 180, render: (branch) => <Typography fontWeight={700} fontSize={13}>{branch.name}</Typography> },
    { key: 'code', label: 'Branch Code', minWidth: 110, nowrap: true, render: (branch) => branch.code },
    { key: 'ifsc', label: 'IFSC Code', minWidth: 130, nowrap: true, render: (branch) => branch.ifsc },
    { key: 'city', label: 'City', minWidth: 110, render: (branch) => branch.city },
    { key: 'customers', label: 'Customers', align: 'right', minWidth: 100, render: (branch) => formatNumber(branch.customers) },
    { key: 'status', label: 'Status', minWidth: 100, render: (branch) => <StatusChip status={branch.status} /> },
    { key: 'actions', label: 'Actions', align: 'right', minWidth: 150, nowrap: true, render: (branch) => (
      <Stack direction="row" spacing={0.25} justifyContent="flex-end">
        <Button size="small" startIcon={<VisibilityOutlinedIcon />} onClick={() => setViewing(branch)}>View</Button>
        <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => openEdit(branch)}>Edit</Button>
      </Stack>
    ) },
  ];

  return (
    <Box>
      <PageHeader
        title="Branch Master"
        subtitle="Create, view and maintain branch details"
      />
      <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', p: 2.5 }}>
          <TextField
            size="small"
            placeholder="Search by branch, code, IFSC or city"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            sx={{ flex: '1 1 320px' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }}
          />
          <Select
            size="small"
            value={status}
            onChange={(event) => { setStatus(event.target.value as BranchStatus | 'all'); setPage(1); }}
            inputProps={{ 'aria-label': 'Filter by status' }}
            sx={{ minWidth: 150 }}
          >
            {BRANCH_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" size="small" startIcon={<AddOutlinedIcon />} onClick={openAdd} sx={{ minHeight: 40 }}>
            Create New
          </Button>
        </Box>
        {error && <Box sx={{ px: 2.5, pb: 2 }}><ErrorState message={error} onRetry={reload} /></Box>}
        <Box sx={{ opacity: loading ? 0.55 : 1, transition: 'opacity .2s' }}>
          <DataTable rows={rows} columns={columns} getRowId={(branch) => branch.id} emptyMessage={loading ? 'Loading branch records…' : 'No branches match your search.'} />
        </Box>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">Showing {from}–{to} of {total} branches</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="inherit" size="small" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
            <Button variant="outlined" color="inherit" size="small" disabled={to >= total} onClick={() => setPage((value) => value + 1)}>Next</Button>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={formOpen} onClose={closeForm} fullWidth maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ fontWeight: 800 }}>{editing ? 'Edit Branch' : 'Create Branch'}</DialogTitle>
        <DialogContent dividers>
          <BranchForm
            editing={editing}
            focusSignal={focusSignal}
            onCancel={closeForm}
            onSaved={(branch, mode) => {
              closeForm();
              setToast(`Branch "${branch.name}" ${mode}.`);
              reload();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewing)} onClose={() => setViewing(null)} fullWidth maxWidth="sm">
        {viewing && (
          <>
            <DialogTitle sx={{ fontWeight: 800 }}>{viewing.name}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {([
                  ['Branch Code', viewing.code], ['IFSC Code', viewing.ifsc], ['Address', viewing.address],
                  ['City', viewing.city], ['Pincode', viewing.pincode], ['Branch Phone', viewing.phone],
                  ['Customers', formatNumber(viewing.customers)], ['Status', viewing.status],
                ] as const).map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={600}>{value || '—'}</Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions><Button size="small" onClick={() => setViewing(null)}>Close</Button><Button size="small" variant="contained" onClick={() => { const row = viewing; setViewing(null); openEdit(row); }}>Edit Branch</Button></DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast(null)}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
}
