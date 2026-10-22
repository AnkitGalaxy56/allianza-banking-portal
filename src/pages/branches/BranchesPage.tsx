import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ErrorState from '@/components/common/ErrorState';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { branchService } from '@/services/branch.service';
import type { Branch, BranchStatus } from '@/types/branch';
import { formatNumber } from '@/utils/format';
import BranchForm from './BranchForm';

const PAGE_SIZE = 8;

/** Bank Admin -> Branches (list + add/edit form), follows the "Branches" reference screen. */
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
    () => branchService.list({ page, pageSize: PAGE_SIZE, search: debouncedSearch, status }),
    [page, debouncedSearch, status],
  );

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <Box>
      <PageHeader
        title="Branches"
        subtitle="Branches of your bank that appear in the mobile app"
        actions={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
              setFocusSignal((n) => n + 1);
            }}
          >
            Add branch
          </Button>
        }
      />

      <Box sx={{
        display: 'grid', gap: 2.5, alignItems: 'start',
        //  gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' }
        gridTemplateColumns: {
          xs: '1fr',
          lg: formOpen
            ? 'minmax(0, 2fr) minmax(320px, 1fr)'
            : 'minmax(0, 1fr)',
        }
      }}>
        <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, p: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search by branch name, code or city"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              sx={{ flex: '1 1 260px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              size="small"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as BranchStatus | 'all');
                setPage(1);
              }}
              inputProps={{ 'aria-label': 'Filter by status' }}
              sx={{ minWidth: 140, fontWeight: 600 }}
            >
              <MenuItem value="all">All status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </Box>

          {error && (
            <Box sx={{ px: 2.5, pb: 2 }}>
              <ErrorState message={error} onRetry={reload} />
            </Box>
          )}

          <TableContainer sx={{ opacity: loading ? 0.55 : 1, transition: 'opacity .2s' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Branch</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Customers</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((branch) => (
                  <TableRow key={branch.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{branch.name}</TableCell>
                    <TableCell>{branch.code}</TableCell>
                    <TableCell>{branch.city}</TableCell>
                    <TableCell>{formatNumber(branch.customers)}</TableCell>
                    <TableCell>
                      <StatusChip status={branch.status} />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Button
                        size="small"
                        sx={{ fontWeight: 700, minWidth: 0 }}
                        onClick={() => {
                          setEditing(branch);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Box component="span" sx={{ color: 'text.secondary' }}>
                        ·
                      </Box>
                      <Button size="small" sx={{ fontWeight: 700, minWidth: 0 }} onClick={() => setViewing(branch)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {data && data.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No branches match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 2.5, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {from}–{to} of {total} branches
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="inherit" size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} sx={{ borderColor: 'divider' }}>
                Previous
              </Button>
              <Button variant="outlined" color="inherit" size="small" disabled={to >= total} onClick={() => setPage((p) => p + 1)} sx={{ borderColor: 'divider' }}>
                Next
              </Button>
            </Box>
          </Box>
        </Paper>

        {formOpen && (
          <BranchForm
            editing={editing}
            focusSignal={focusSignal}
            onCancel={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            onSaved={(branch, mode) => {
              setFormOpen(false);
              setEditing(null);
              setToast(`Branch "${branch.name}" ${mode}.`);
              reload();
            }}
          />
        )}
      </Box>

      <Dialog open={Boolean(viewing)} onClose={() => setViewing(null)} fullWidth maxWidth="xs">
        {viewing && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {viewing.name}
              <StatusChip status={viewing.status} />
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 3, rowGap: 1.25 }}>
                {(
                  [
                    ['Code', viewing.code],
                    ['IFSC', viewing.ifsc],
                    ['Address', viewing.address],
                    ['City', viewing.city],
                    ['Pincode', viewing.pincode],
                    ['Phone', viewing.phone],
                    ['Customers', formatNumber(viewing.customers)],
                  ] as const
                ).map(([label, value]) => (
                  <Box key={label} sx={{ display: 'contents' }}>
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewing(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast(null)}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}









