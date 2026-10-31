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
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Link as RouterLink } from 'react-router-dom';
import BarListCard from '@/components/common/BarListCard';
import ErrorState from '@/components/common/ErrorState';
import FullPageLoader from '@/components/common/FullPageLoader';
import PageHeader from '@/components/common/PageHeader';
import QuickActionsCard, { type QuickAction } from '@/components/common/QuickActionsCard';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';
import { ROLES } from '@/config/roles';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { PATHS } from '@/routes/paths';
import { dashboardService } from '@/services/dashboard.service';

const ADMIN_ACTIONS: QuickAction[] = [
  { label: 'Send push notification', to: PATHS.pushNotifications, icon: NotificationsNoneOutlinedIcon },
  { label: 'Upload banner', to: PATHS.banners, icon: ImageOutlinedIcon },
  { label: 'Reset customer device', to: PATHS.deviceReset, icon: SmartphoneOutlinedIcon },
  { label: 'Add branch user', to: PATHS.MASTERS.BRANCH_MASTER, icon: AddOutlinedIcon },
];

const USER_ACTIONS: QuickAction[] = [
  { label: 'Review service requests', to: PATHS.serviceRequests, icon: DescriptionOutlinedIcon },
  { label: 'Find a customer', to: PATHS.customers, icon: PeopleAltOutlinedIcon },
];

/** Dashboard for Bank Admin and Bank User (layout follows the Bank Admin reference design). */
export default function BankDashboard() {
  const user = useAppSelector(selectUser);
  const isAdmin = user?.role === ROLES.BANK_ADMIN;
  const [branch, setBranch] = useState('');

  const { data, loading, error, reload } = useAsyncData(
    () => dashboardService.getBankDashboard(branch || undefined),
    [branch],
  );

  if (!data && loading) return <FullPageLoader />;
  if (!data) return <ErrorState message={error ?? 'Unable to load the dashboard.'} onRetry={reload} />;

  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity .2s' }}>
      <PageHeader
        title="Dashboard"
        subtitle="Customers, requests and branches for your bank"
        actions={
          <>
            <Select
              size="small"
              displayEmpty
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              inputProps={{ 'aria-label': 'Filter by branch' }}
              sx={{ minWidth: 150, fontWeight: 600 }}
            >
              <MenuItem value="">All branches</MenuItem>
              {data.branches.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
            {isAdmin && (
              <Button
                component={RouterLink}
                to={PATHS.pushNotifications}
                variant="contained"
                startIcon={<NotificationsNoneOutlinedIcon />}
              >
                Send notification
              </Button>
            )}
          </>
        }
      />

      {error && (
        <Box sx={{ mb: 2 }}>
          <ErrorState message={error} onRetry={reload} />
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          mb: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
        }}
      >
        {data.stats.map((stat) => (
          <StatCard key={stat.key} data={stat} />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' } }}>
        <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
            <Typography variant="subtitle1">Service requests</Typography>
            <Button component={RouterLink} to={PATHS.serviceRequests} size="small" sx={{ fontWeight: 700 }}>
              View all requests
            </Button>
          </Box>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Request</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentRequests.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.submitted}</TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button component={RouterLink} to={PATHS.serviceRequests} size="small" sx={{ fontWeight: 700 }}>
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {data.recentRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No service requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <QuickActionsCard actions={isAdmin ? ADMIN_ACTIONS : USER_ACTIONS} />
          <BarListCard title="Lead enquiries this week" items={data.leadEnquiries} />
        </Box>
      </Box>
    </Box>
  );
}
