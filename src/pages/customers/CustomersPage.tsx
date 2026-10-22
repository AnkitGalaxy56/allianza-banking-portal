import { useMemo, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Divider, MenuItem, Paper, Select, Snackbar, Stack,
  TextField, Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import StatusChip from '@/components/common/StatusChip';
import ErrorState from '@/components/common/ErrorState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { customerService } from '@/services/customer.service';
import type { Customer, CustomerStatus } from '@/types/customer';
import { formatNumber } from '@/utils/format';

const PAGE_SIZE = 8;
const BRANCHES = [
  { id: 'br-001', name: 'Main branch' }, { id: 'br-002', name: 'Branch 2' },
  { id: 'br-003', name: 'Branch 3' }, { id: 'br-004', name: 'Branch 4' },
  { id: 'br-005', name: 'Branch 5' }, { id: 'br-006', name: 'Branch 6' },
  { id: 'br-007', name: 'Branch 7' }, { id: 'br-008', name: 'Branch 8' },
];

function Metric({ label, value }: { label: string; value: string }) {
  return <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, minWidth: 0 }}>
    <Typography variant="body2" color="text.secondary" fontWeight={600}>{label}</Typography>
    <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>{value}</Typography>
  </Paper>;
}

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('all');
  const [status, setStatus] = useState<CustomerStatus | 'all'>('all');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' | 'info' } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, loading, error, reload } = useAsyncData(
    () => customerService.list({ page, pageSize: PAGE_SIZE, search: debouncedSearch, branchId, status }),
    [page, debouncedSearch, branchId, status, refreshKey],
  );
  const rows = data?.items ?? [];
  const activeSelected = selected;
  const total = data?.total ?? 0;
  const columns = useMemo<DataTableColumn<Customer>[]>(() => [
    { key: 'number', label: 'Customer number', minWidth: 130, render: (c) => <Typography fontSize={13} fontWeight={800}>{c.customerNumber}</Typography>, nowrap: true },
    { key: 'mobile', label: 'Mobile', minWidth: 120, render: (c) => c.mobile, nowrap: true },
    { key: 'branch', label: 'Branch', minWidth: 100, render: (c) => c.branchName },
    { key: 'registered', label: 'Registered', minWidth: 105, render: (c) => c.registered },
    { key: 'device', label: 'Device', render: (c) => c.device },
    { key: 'lastLogin', label: 'Last login', minWidth: 105, render: (c) => c.lastLogin },
    { key: 'status', label: 'Status', render: (c) => <StatusChip status={c.status.toLowerCase()} /> },
    {
      key: 'actions', label: 'Actions', minWidth: 85, nowrap: true,
      render: (c) => (
        <Button
          size="small"
          startIcon={<VisibilityOutlinedIcon fontSize="small" />}
          onClick={(event) => { event.stopPropagation(); setSelected(c); }}
        >
          View
        </Button>
      ),
    },
  ], []);
  const updateStatus = async (nextStatus: CustomerStatus) => {
    if (!activeSelected) return;
    try {
      await customerService.updateStatus(activeSelected.id, nextStatus);
      setFeedback({ message: nextStatus === 'Blocked' ? 'Customer app access blocked.' : 'Customer status updated.', severity: 'success' });
      setRefreshKey((v) => v + 1);
      reload();
    } catch (e) {
      setFeedback({ message: e instanceof Error ? e.message : 'Unable to update customer.', severity: 'error' });
    }
  };
  const resetDevice = async () => {
    if (!activeSelected) return;
    try {
      await customerService.resetDevice(activeSelected.id);
      setFeedback({ message: 'Device reset requested successfully.', severity: 'success' });
    } catch (e) {
      setFeedback({ message: e instanceof Error ? e.message : 'Unable to reset device.', severity: 'error' });
    }
  };
  return (
    <Box>
      <PageHeader title="Customers" subtitle="Customers of your bank who use the mobile app" />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 2, mb: 2.5, '@media (max-width: 900px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' } }}>
        <Metric label="Registered customers" value="38,210" />
        <Metric label="Active this month" value="24,870" />
        <Metric label="Pending MPIN setup" value="412" />
        <Metric label="Blocked" value="36" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: activeSelected
        ? { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.8fr) minmax(300px, 1fr)' }
        : 'minmax(0, 1fr)', gap: 2.5, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, p: 2.5 }}>
            <TextField size="small" placeholder="Search by customer number or mobile" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              sx={{ flex: '1 1 260px' }} InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" /> }} />
            <Select size="small" value={branchId} onChange={(e) => { setBranchId(e.target.value); setPage(1); }} sx={{ minWidth: 145 }}>
              <MenuItem value="all">All branches</MenuItem>{BRANCHES.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </Select>
            <Select size="small" value={status} onChange={(e) => { setStatus(e.target.value as CustomerStatus | 'all'); setPage(1); }} sx={{ minWidth: 125 }}>
              <MenuItem value="all">All status</MenuItem><MenuItem value="Active">Active</MenuItem><MenuItem value="Pending">Pending</MenuItem><MenuItem value="Blocked">Blocked</MenuItem>
            </Select>
            <Button variant="outlined" color="inherit" onClick={() => setFeedback({ message: 'Export can be connected to CSV/API next.', severity: 'info' })}>Export</Button>
          </Box>
          {error && <Box sx={{ px: 2.5, pb: 2 }}><ErrorState message={error} onRetry={reload} /></Box>}
          <Box sx={{ opacity: loading ? 0.55 : 1 }}>
            <DataTable rows={rows} columns={columns} getRowId={(c) => c.id} />
          </Box>
          <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">Showing {total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)} of {formatNumber(total)} customers</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="inherit" size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outlined" color="inherit" size="small" disabled={page * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </Stack>
          </Box>
        </Paper>
        {activeSelected && <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight={800}>Customer details</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <StatusChip status={activeSelected.status.toLowerCase()} />
              <Button aria-label="Close customer details" color="inherit" size="small" onClick={() => setSelected(null)} sx={{ minWidth: 32, px: 0.5 }}>
                <CloseOutlinedIcon fontSize="small" />
              </Button>
            </Stack>
          </Stack>
          <>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
              <Avatar sx={{ width: 52, height: 52, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 800 }}>
                {activeSelected.customerNumber.slice(-2)}
              </Avatar>
              <Box><Typography fontWeight={800}>{`Customer ${activeSelected.customerNumber.slice(-4)}`}</Typography><Typography variant="body2" color="text.secondary">{activeSelected.mobile}</Typography></Box>
            </Stack>
            {([
              ['Registered mobile', activeSelected.mobile],
              ['Branch', activeSelected.branchName],
              ['Registered on', activeSelected.registered],
              ['Device', activeSelected.device === 'Android' ? 'Android phone' : 'iPhone'],
              ['Last login', activeSelected.lastLogin],
              ['Open requests', String(activeSelected.openRequests)],
            ] as const).map(([label, value]) => <Box key={label}>
              <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ py: 1.35 }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontWeight={700} textAlign="right">{value}</Typography>
              </Stack>
              <Divider />
            </Box>)}
            <Stack direction={{ xs: 'column', sm: 'row', xl: 'column' }} spacing={1.25} mt={2}>
              <Button fullWidth variant="outlined" color="inherit" onClick={() => void resetDevice()}>Reset device</Button>
              <Button fullWidth variant="outlined" color="error" onClick={() => void updateStatus(activeSelected.status === 'Blocked' ? 'Active' : 'Blocked')}>
                {activeSelected.status === 'Blocked' ? 'Unblock app access' : 'Block app access'}
              </Button>
            </Stack>
          </>
        </Paper>}
      </Box>
      <Snackbar open={Boolean(feedback)} autoHideDuration={3500} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {feedback ? <Alert severity={feedback.severity} variant="filled" onClose={() => setFeedback(null)} sx={{ width: '100%' }}>{feedback.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
