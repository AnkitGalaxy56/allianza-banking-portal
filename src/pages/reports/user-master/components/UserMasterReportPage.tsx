import { useMemo, useState } from 'react';
import { Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import { userMasterReportRows } from '../data/userMasterReportData';
import type { UserMasterReportRow, UserMasterReportFilterState } from '../types/usermasterReport';

const columns: DataTableColumn<UserMasterReportRow>[] = [
  { key: 'employeeNo', label: 'Employee no.', minWidth: 115, nowrap: true },
  { key: 'employeeName', label: 'Employee name', minWidth: 145 },
  { key: 'designation', label: 'Designation', minWidth: 155 },
  { key: 'role', label: 'User role', minWidth: 110 },
  { key: 'branch', label: 'Branch', minWidth: 105 },
  { key: 'mobile', label: 'Mobile', minWidth: 115, nowrap: true },
  { key: 'email', label: 'Email ID', minWidth: 190, truncate: true },
  { key: 'status', label: 'Status', minWidth: 95 },
  { key: 'lastLogin', label: 'Last login', minWidth: 155, nowrap: true },
];
const initialFilters: UserMasterReportFilterState = { search: '', branch: 'All branches', status: 'All statuses', fromDate: '', toDate: '' };
const branches = ['Main branch', 'Branch 2', 'Branch 4', 'Branch 7'];
const statuses = ['Active', 'Inactive', 'Locked'];
const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  if (['Completed', 'Delivered', 'Active'].includes(status)) return 'success';
  if (['Pending', 'Partially Delivered'].includes(status)) return 'warning';
  if (['Failed', 'Inactive', 'Locked'].includes(status)) return 'error';
  return 'default';
};

// This module owns its filters, filtering, columns, CSV export and table rendering.
export default function UserMasterReportPage() {
  const [filters, setFilters] = useState<UserMasterReportFilterState>(initialFilters);
  const filteredRows = useMemo(() => userMasterReportRows.filter((row) => {
    const term = filters.search.trim().toLowerCase();
    const matchesSearch = !term || [row.employeeNo, row.employeeName, row.email, row.mobile, row.role].some((value) => String(value ?? '').toLowerCase().includes(term));
    const matchesBranch = (filters.branch === 'All branches' || row.branch === filters.branch);
    const dateValue = String(row.lastLoginDate ?? '');
    const matchesStatus = filters.status === 'All statuses' || row.status === filters.status;
    const matchesFrom = !filters.fromDate || (dateValue !== '' && dateValue >= filters.fromDate);
    const matchesTo = !filters.toDate || (dateValue !== '' && dateValue <= filters.toDate);
    return matchesSearch && matchesBranch && matchesStatus && matchesFrom && matchesTo;
  }), [filters]);
  const updateFilter = (key: keyof UserMasterReportFilterState, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const exportCsv = () => {
    const rows = [columns.map((column) => column.label), ...filteredRows.map((row) => columns.map((column) => String(row[column.key as keyof UserMasterReportRow] ?? '')))];
    const csv = rows.map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'user-master-report.csv'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
  };
  const tableColumns: DataTableColumn<UserMasterReportRow>[] = columns.map((column) => column.key !== 'status' ? column : {
    ...column,
    render: (row) => <Chip size="small" label={row.status} color={getStatusColor(row.status)} variant="outlined" sx={{ height: 22, fontSize: 11, fontWeight: 700 }} />,
  });
  return <Box>
    <PageHeader title="User Master Report" subtitle="View employee, role, branch, contact and account-status information." actions={<Button variant="contained" size="small" startIcon={<DownloadOutlinedIcon />} onClick={exportCsv} disabled={filteredRows.length === 0}>Export CSV</Button>} />
    <Paper variant="outlined" sx={{ borderRadius: 2.5, p: { xs: 1.5, md: 2 }, mb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={750}>Filter records</Typography>
        <Button size="small" color="inherit" startIcon={<RestartAltOutlinedIcon />} onClick={() => setFilters(initialFilters)}>Reset</Button>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(5, minmax(0, 1fr))' }, gap: 1.25 }}>
        <TextField size="small" label="Search" placeholder="Employee ID, name, email or mobile" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} InputProps={{ startAdornment: <SearchOutlinedIcon fontSize="small" sx={{ mr: 0.75, color: 'text.disabled' }} /> }} />
        <TextField size="small" select label="Branch" value={filters.branch} onChange={(event) => updateFilter('branch', event.target.value)}><MenuItem value="All branches">All branches</MenuItem>{branches.map((branch) => <MenuItem key={branch} value={branch}>{branch}</MenuItem>)}</TextField>
        <TextField size="small" select label="Status" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}><MenuItem value="All statuses">All statuses</MenuItem>{statuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}</TextField>
        <TextField size="small" type="date" label="From date" value={filters.fromDate} onChange={(event) => updateFilter('fromDate', event.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField size="small" type="date" label="To date" value={filters.toDate} onChange={(event) => updateFilter('toDate', event.target.value)} InputLabelProps={{ shrink: true }} />
      </Box>
    </Paper>
    <Paper variant="outlined" sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box><Typography variant="subtitle1" fontWeight={750}>User Master Report</Typography><Typography variant="caption" color="text.secondary">Historical report records</Typography></Box>
        <Chip size="small" label={`${filteredRows.length} records`} variant="outlined" />
      </Box>
      <DataTable rows={filteredRows} columns={tableColumns} getRowId={(row) => row.id} emptyMessage="No report records match the selected filters." />
    </Paper>
  </Box>;
}
