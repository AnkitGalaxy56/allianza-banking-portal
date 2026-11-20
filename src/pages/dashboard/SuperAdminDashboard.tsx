import { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import { Link as RouterLink } from 'react-router-dom';
import BarListCard from '@/components/common/BarListCard';
import ErrorState from '@/components/common/ErrorState';
import FullPageLoader from '@/components/common/FullPageLoader';
import PageHeader from '@/components/common/PageHeader';
import RequestHandlingCounts from '@/components/common/RequestHandlingCounts';
import QuickActionsCard, { type QuickAction } from '@/components/common/QuickActionsCard';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PATHS } from '@/routes/paths';
import { dashboardService } from '@/services/dashboard.service';
import { formatNumber } from '@/utils/format';

const ACTIONS: QuickAction[] = [
  { label: 'Bank management', to: PATHS.MASTERS.BANK_MASTER, icon: AccountBalanceOutlinedIcon },
  { label: 'User management', to: PATHS.USER_MANAGEMENT.USER_MASTER, icon: ManageAccountsOutlinedIcon },
  { label: 'Push notification', to: PATHS.MOBILE_UTILITIES.PUSH_NOTIFICATION, icon: NotificationsNoneOutlinedIcon },
  { label: 'Device reset', to: PATHS.MOBILE_UTILITIES.DEVICE_RESET, icon: SmartphoneOutlinedIcon },
  { label: 'Upload image', to: PATHS.MOBILE_UTILITIES.IMAGE_UPLOADING, icon: ImageOutlinedIcon },
  { label: 'Reports', to: PATHS.REPORTS.REQUESTS, icon: BarChartOutlinedIcon },
];

/** Allianza (super admin) dashboard - follows slide 14 of the project document. */
export default function SuperAdminDashboard() {
  const { data, loading, error, reload } = useAsyncData(() => dashboardService.getSuperAdminDashboard(), []);

  const [selectedBankCode, setSelectedBankCode] = useState('');

  if (loading && !data) return <FullPageLoader />;
  if (!data) return <ErrorState message={error ?? 'Unable to load the dashboard.'} onRetry={reload} />;

  const selectedBank = data.recentBanks.find((bank) => bank.code === selectedBankCode);
  const visibleBanks = selectedBank ? data.recentBanks.filter((bank) => bank.code === selectedBank.code) : data.recentBanks;
  const visibleRequests = selectedBank
    ? data.requestsByBank.filter((item) => item.label === selectedBank.name)
    : data.requestsByBank;
  const selectedRequestCount = visibleRequests.reduce((sum, item) => sum + item.count, 0);

  const displayStats = data.stats.map((stat) => {
    if (!selectedBank) return stat;
    if (stat.key === 'banks') return { ...stat, value: '1', helper: 'Selected bank', helperTone: 'neutral' as const };
    if (stat.key === 'users') return { ...stat, value: formatNumber(selectedBank.users), helper: 'Selected bank users', helperTone: 'neutral' as const };
    if (stat.key === 'requests') return { ...stat, value: formatNumber(selectedRequestCount), helper: 'Selected bank requests', helperTone: 'neutral' as const };
    return stat;
  });

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Banks, application users and requests across the platform"
        actions={
          <>
            <Select
              size="small"
              displayEmpty
              value={selectedBankCode}
              onChange={(e) => setSelectedBankCode(e.target.value)}
              inputProps={{ 'aria-label': 'Filter by bank' }}
              sx={{ minWidth: 250, fontWeight: 600 }}
            >
              <MenuItem value="">All banks</MenuItem>
              {data.recentBanks.map((bank) => (
                <MenuItem key={bank.id} value={bank.code}>
                  {bank.name}
                </MenuItem>
              ))}
            </Select>
            <Button component={RouterLink} to={PATHS.MASTERS.BANK_MASTER} variant="contained" startIcon={<AccountBalanceOutlinedIcon />}>
              Manage banks
            </Button>
          </>
        }
      />

      <RequestHandlingCounts />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          mb: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: `repeat(${data.stats.length}, minmax(0, 1fr))` },
        }}
      >
        {displayStats.map((stat) => (
          <StatCard key={stat.key} data={stat} />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' } }}>
        <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle1">Onboarded banks</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bank</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Branches</TableCell>
                  <TableCell align="right">App users</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleBanks.map((bank) => (
                  <TableRow key={bank.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{bank.name}</TableCell>
                    <TableCell>{bank.code}</TableCell>
                    <TableCell>{bank.type}</TableCell>
                    <TableCell align="right">{formatNumber(bank.branches)}</TableCell>
                    <TableCell align="right">{formatNumber(bank.users)}</TableCell>
                    <TableCell>
                      <StatusChip status={bank.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <QuickActionsCard actions={ACTIONS} />
          <BarListCard title="Requests by bank" items={visibleRequests} />
        </Box>
      </Box>
    </Box>
  );
}
