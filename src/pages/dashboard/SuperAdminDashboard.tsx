import {
  Box,
  Button,
  Paper,
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
import QuickActionsCard, { type QuickAction } from '@/components/common/QuickActionsCard';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PATHS } from '@/routes/paths';
import { dashboardService } from '@/services/dashboard.service';
import { formatNumber } from '@/utils/format';

const ACTIONS: QuickAction[] = [
  { label: 'Bank management', to: PATHS.banks, icon: AccountBalanceOutlinedIcon },
  { label: 'User management', to: PATHS.users, icon: ManageAccountsOutlinedIcon },
  { label: 'Push notification', to: PATHS.pushNotifications, icon: NotificationsNoneOutlinedIcon },
  { label: 'Device reset', to: PATHS.deviceReset, icon: SmartphoneOutlinedIcon },
  { label: 'Upload image', to: PATHS.uploadImages, icon: ImageOutlinedIcon },
  { label: 'Reports', to: PATHS.reports, icon: BarChartOutlinedIcon },
];

/** Allianza (super admin) dashboard - follows slide 14 of the project document. */
export default function SuperAdminDashboard() {
  const { data, loading, error, reload } = useAsyncData(() => dashboardService.getSuperAdminDashboard(), []);

  if (loading && !data) return <FullPageLoader />;
  if (!data) return <ErrorState message={error ?? 'Unable to load the dashboard.'} onRetry={reload} />;

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Banks, application users and requests across the platform"
        actions={
          <Button component={RouterLink} to={PATHS.MASTERS.BANK_MASTER} variant="contained" startIcon={<AccountBalanceOutlinedIcon />}>
            Manage banks
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          mb: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: `repeat(${data.stats.length}, minmax(0, 1fr))` },
        }}
      >
        {data.stats.map((stat) => (
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
                {data.recentBanks.map((bank) => (
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
          <BarListCard title="Requests by bank" items={data.requestsByBank} />
        </Box>
      </Box>
    </Box>
  );
}
