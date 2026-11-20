import { useMemo, useState } from 'react';
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
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
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
import type { StatCardData } from '@/types/dashboard';

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

/**
 * Temporary component-level dashboard analytics.
 *
 * IMPORTANT: this data is intentionally separate from the dashboard API because
 * GET /api/v1/dashboard/bank currently does not expose bank/branch/request-type
 * analytics. When the backend contract is ready, replace DEMO_BANKS with the
 * API response and keep the aggregation/filtering logic below unchanged.
 */
type RequestMetric = {
  total: number;
  pending: number;
};

type DemoBranch = {
  id: string;
  name: string;
  portalUsers: number;
  mobileUsers: number;
  requests: Record<string, RequestMetric>;
};

type DemoBank = {
  id: string;
  code: string;
  name: string;
  branches: DemoBranch[];
};

const REQUEST_TYPES = [
  'Payments',
  'Cheque Book',
  'Stop Payment',
  'FD Opening',
  'RD Opening',
  'FD / RD Closing',
  'Locker Application',
  'Standing Instructions',
  'Fresh Loan Application',
  'Loan EMI Payment',
  'Opening Accounts',
  'Lead Management',
  'RTGS / NEFT / IMPS',
];

const makeRequests = (values: number[], pending: number[]): Record<string, RequestMetric> =>
  REQUEST_TYPES.reduce<Record<string, RequestMetric>>((acc, type, index) => {
    acc[type] = { total: values[index] ?? 0, pending: pending[index] ?? 0 };
    return acc;
  }, {});

const DEMO_BANKS: DemoBank[] = [
  {
    id: 'sample-urban',
    code: 'PUNE001',
    name: 'Sample Urban Co-op Bank',
    branches: [
      { id: 'BR001', name: 'Pune Main', portalUsers: 8, mobileUsers: 1240, requests: makeRequests([12, 7, 4, 6, 4, 3, 2, 2, 4, 3, 2, 1, 7], [3, 2, 1, 2, 1, 1, 0, 1, 1, 1, 1, 0, 2]) },
      { id: 'BR002', name: 'Camp', portalUsers: 5, mobileUsers: 980, requests: makeRequests([8, 5, 3, 4, 3, 2, 1, 2, 3, 2, 2, 1, 5], [2, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1]) },
      { id: 'BR003', name: 'Kothrud', portalUsers: 4, mobileUsers: 760, requests: makeRequests([6, 4, 2, 3, 2, 2, 1, 1, 2, 1, 1, 1, 4], [1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1]) },
      { id: 'BR004', name: 'Hadapsar', portalUsers: 3, mobileUsers: 610, requests: makeRequests([5, 3, 2, 2, 2, 1, 1, 1, 2, 1, 1, 0, 3], [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1]) },
    ],
  },
  {
    id: 'demo-sahakari',
    code: 'MUM002',
    name: 'Demo Sahakari Bank',
    branches: [
      { id: 'BR101', name: 'Mumbai Main', portalUsers: 9, mobileUsers: 1520, requests: makeRequests([15, 8, 4, 7, 5, 3, 2, 2, 5, 3, 3, 2, 8], [4, 2, 1, 2, 2, 1, 1, 0, 2, 1, 1, 0, 2]) },
      { id: 'BR102', name: 'Andheri', portalUsers: 6, mobileUsers: 1040, requests: makeRequests([9, 5, 3, 4, 3, 2, 1, 1, 3, 2, 2, 1, 5], [2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1]) },
      { id: 'BR103', name: 'Thane', portalUsers: 5, mobileUsers: 920, requests: makeRequests([7, 4, 2, 3, 3, 2, 1, 1, 2, 2, 1, 1, 4], [2, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1]) },
    ],
  },
  {
    id: 'nagar-coop',
    code: 'NGR003',
    name: 'Nagar Co-op Bank',
    branches: [
      { id: 'BR201', name: 'Ahmednagar Main', portalUsers: 7, mobileUsers: 1180, requests: makeRequests([10, 6, 3, 5, 4, 2, 2, 1, 4, 2, 2, 1, 6], [2, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 2]) },
      { id: 'BR202', name: 'Shrirampur', portalUsers: 4, mobileUsers: 680, requests: makeRequests([6, 3, 2, 3, 2, 1, 1, 1, 2, 1, 1, 1, 3], [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1]) },
    ],
  },
];

function aggregateBranches(branches: DemoBranch[]) {
  const requestMap = REQUEST_TYPES.reduce<Record<string, RequestMetric>>((acc, type) => {
    acc[type] = { total: 0, pending: 0 };
    return acc;
  }, {});

  let portalUsers = 0;
  let mobileUsers = 0;

  branches.forEach((branch) => {
    portalUsers += branch.portalUsers;
    mobileUsers += branch.mobileUsers;
    REQUEST_TYPES.forEach((type) => {
      requestMap[type].total += branch.requests[type].total;
      requestMap[type].pending += branch.requests[type].pending;
    });
  });

  const totalRequests = Object.values(requestMap).reduce((sum, item) => sum + item.total, 0);
  const pendingRequests = Object.values(requestMap).reduce((sum, item) => sum + item.pending, 0);

  return { requestMap, portalUsers, mobileUsers, totalRequests, pendingRequests };
}

/** Dashboard for Bank Admin and Bank User. */
export default function BankDashboard() {
  const user = useAppSelector(selectUser);
  const isAdmin = user?.role === ROLES.BANK_ADMIN;
  const [branchId, setBranchId] = useState('');

  // A bank dashboard is always scoped to the bank selected at login.
  // The user must never be able to switch to another bank from this screen.
  // The bankCode is supplied by the authenticated user/session.
  const selectedBank = useMemo(() => {
    const userBank = DEMO_BANKS.find((bank) => bank.id === user?.bankCode || bank.code === user?.bankCode);
    return userBank ?? DEMO_BANKS[0];
  }, [user?.bankCode]);
  const availableBranches = selectedBank?.branches ?? [];

  const selectedBranchId = branchId && availableBranches.some((branch) => branch.id === branchId)
    ? branchId
    : '';

  const scopedBranches = selectedBranchId
    ? availableBranches.filter((branch) => branch.id === selectedBranchId)
    : availableBranches;

  const analytics = useMemo(() => {
    const bankScope = selectedBank ? [selectedBank] : [];
    const branchScope = selectedBranchId
      ? bankScope.flatMap((bank) => bank.branches.filter((branch) => branch.id === selectedBranchId))
      : bankScope.flatMap((bank) => bank.branches);

    return {
      branches: branchScope,
      aggregate: aggregateBranches(branchScope),
    };
  }, [selectedBank, selectedBranchId]);

  const branchRows = analytics.branches.map((branch) => ({
    ...branch,
    totalRequests: Object.values(branch.requests).reduce((sum, item) => sum + item.total, 0),
    pendingRequests: Object.values(branch.requests).reduce((sum, item) => sum + item.pending, 0),
  }));

  const requestMix = REQUEST_TYPES
    .map((label) => ({ label, ...analytics.aggregate.requestMap[label] }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxBranchRequests = Math.max(...branchRows.map((item) => item.totalRequests), 1);

  const dashboardStats: StatCardData[] = [
    {
      key: 'branches',
      label: 'Branches',
      value: String(analytics.branches.length),
      helper: selectedBranchId ? 'Selected branch' : 'Selected bank',
      helperTone: 'neutral',
      icon: 'branches',
    },
    {
      key: 'portal-users',
      label: 'Portal users',
      value: analytics.aggregate.portalUsers.toLocaleString('en-IN'),
      helper: 'Bank portal users',
      helperTone: 'success',
      icon: 'users',
    },
    {
      key: 'mobile-users',
      label: 'Mobile users',
      value: analytics.aggregate.mobileUsers.toLocaleString('en-IN'),
      helper: 'Registered mobile users',
      helperTone: 'success',
      icon: 'users',
    },
    {
      key: 'pending',
      label: 'Pending requests',
      value: String(analytics.aggregate.pendingRequests),
      helper: 'Across all request modules',
      helperTone: 'warning',
      icon: 'requests',
    },
    {
      key: 'total',
      label: 'Total requests',
      value: String(analytics.aggregate.totalRequests),
      helper: 'Across all request modules',
      helperTone: 'neutral',
      icon: 'requests',
    },
  ];

  // Existing API remains intact for recent service requests and lead enquiries.
  // The branch parameter is still passed to the existing endpoint when a branch is selected.
  const apiBranchName = selectedBranchId
    ? availableBranches.find((branch) => branch.id === selectedBranchId)?.name
    : undefined;

  const { data, loading, error, reload } = useAsyncData(
    () => dashboardService.getBankDashboard(apiBranchName),
    [apiBranchName],
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
              value={selectedBranchId}
              onChange={(e) => setBranchId(e.target.value)}
              inputProps={{ 'aria-label': 'Filter by branch' }}
              sx={{ minWidth: 180, fontWeight: 600 }}
            >
              <MenuItem value="">All branches</MenuItem>
              {availableBranches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
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
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(5, minmax(0, 1fr))' },
        }}
      >
        {dashboardStats.map((stat) => (
          <StatCard key={stat.key} data={stat} />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, mb: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' } }}>
        <Paper variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
            <Box>
              <Typography variant="subtitle1">Requests by branch</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedBank?.name} — branch-wise request volume
              </Typography>
            </Box>
            <Box sx={{ width: 42, height: 42, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: 'primary.light', color: 'primary.main' }}>
              <AccountBalanceOutlinedIcon fontSize="small" />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 2 }}>
            {branchRows.map((item) => (
              <Box key={item.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.75 }}>
                  <Typography variant="body2" fontWeight={700}>{item.name}</Typography>
                  <Typography variant="body2" fontWeight={800}>{item.totalRequests} requests</Typography>
                </Box>
                <Box sx={{ height: 10, borderRadius: 99, bgcolor: 'action.hover', overflow: 'hidden' }}>
                  <Box sx={{ width: `${(item.totalRequests / maxBranchRequests) * 100}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 99 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="warning.dark">Pending {item.pendingRequests}</Typography>
                  <Typography variant="caption" color="text.secondary">Portal {item.portalUsers}</Typography>
                  <Typography variant="caption" color="text.secondary">Mobile {item.mobileUsers}</Typography>
                </Box>
              </Box>
            ))}
            {!branchRows.length && (
              <Typography color="text.secondary">No branches found for this scope.</Typography>
            )}
          </Box>
        </Paper>

        <Paper variant="outlined" className="app-card" sx={{ p: 2.5, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1">Request type breakdown</Typography>
              <Typography variant="body2" color="text.secondary">
                All Request Handling modules combined
              </Typography>
            </Box>
            <Box sx={{ width: 42, height: 42, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: 'primary.light', color: 'primary.main' }}>
              <RequestQuoteOutlinedIcon fontSize="small" />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 1.05 }}>
            {requestMix.map((item) => (
              <Box key={item.label} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 1.5, alignItems: 'center' }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" noWrap>{item.label}</Typography>
                  <Box sx={{ height: 7, mt: 0.45, borderRadius: 99, bgcolor: 'action.hover', overflow: 'hidden' }}>
                    <Box sx={{ width: `${(item.total / Math.max(requestMix[0]?.total ?? 1, 1)) * 100}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 99 }} />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" fontWeight={800}>{item.total}</Typography>
                  <Typography variant="caption" display="block" color="warning.dark">{item.pending} pending</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' } }}>
        <Paper variant="outlined" className="app-card" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
            <Typography variant="subtitle1">Recent service requests</Typography>
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
                    <TableCell><StatusChip status={row.status} /></TableCell>
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
