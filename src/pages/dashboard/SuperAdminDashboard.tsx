import { useEffect, useMemo, useState } from 'react';
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
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import { Link as RouterLink } from 'react-router-dom';

import BarListCard from '@/components/common/BarListCard';
import ErrorState from '@/components/common/ErrorState';
import FullPageLoader from '@/components/common/FullPageLoader';
import PageHeader from '@/components/common/PageHeader';
import QuickActionsCard, {
  type QuickAction,
} from '@/components/common/QuickActionsCard';
import StatCard from '@/components/common/StatCard';
import StatusChip from '@/components/common/StatusChip';

import { useAsyncData } from '@/hooks/useAsyncData';
import { PATHS } from '@/routes/paths';

import { dashboardService } from '@/services/dashboard.service';
import { mastersService } from '@/services/masters.service';

import { formatNumber } from '@/utils/format';

import type {
  BankSummaryRow,
  StatCardData,
} from '@/types/dashboard';

/* -------------------------------------------------------------------------- */
/* Quick Actions                                                               */
/* -------------------------------------------------------------------------- */

const ACTIONS: QuickAction[] = [
  {
    label: 'Bank management',
    to: PATHS.MASTERS.BANK_MASTER,
    icon: AccountBalanceOutlinedIcon,
  },
  {
    label: 'User management',
    to: PATHS.USER_MANAGEMENT.USER_MASTER,
    icon: ManageAccountsOutlinedIcon,
  },
  {
    label: 'Push notification',
    to: PATHS.MOBILE_UTILITIES.PUSH_NOTIFICATION,
    icon: NotificationsNoneOutlinedIcon,
  },
  {
    label: 'Device reset',
    to: PATHS.MOBILE_UTILITIES.DEVICE_RESET,
    icon: SmartphoneOutlinedIcon,
  },
  {
    label: 'Upload image',
    to: PATHS.MOBILE_UTILITIES.IMAGE_UPLOADING,
    icon: ImageOutlinedIcon,
  },
  {
    label: 'Reports',
    to: PATHS.REPORTS.REQUESTS,
    icon: BarChartOutlinedIcon,
  },
];

/* -------------------------------------------------------------------------- */
/* Dummy analytics                                                             */
/* -------------------------------------------------------------------------- */

/**
 * IMPORTANT
 *
 * These are ONLY fallback analytics for the Allianza dashboard.
 *
 * The backend dashboard API currently does not return all the analytics
 * required by the UI, especially:
 *
 * - branch-wise requests
 * - request type breakdown
 * - branch counts
 * - application users by bank
 *
 * Once backend provides these values, API values will be used first.
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

type DemoBankAnalytics = {
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

const makeRequests = (
  totals: number[],
  pending: number[],
): Record<string, RequestMetric> => {
  return REQUEST_TYPES.reduce<Record<string, RequestMetric>>(
    (acc, type, index) => {
      acc[type] = {
        total: totals[index] ?? 0,
        pending: pending[index] ?? 0,
      };

      return acc;
    },
    {},
  );
};

/**
 * Component-level dummy data.
 *
 * This does NOT control login, role, portal selection or routing.
 * It is ONLY used for missing Allianza dashboard analytics.
 */
const DEMO_ANALYTICS: DemoBankAnalytics[] = [
  {
    code: 'sample-urban',
    name: 'Sample Urban Co-op Bank',

    branches: [
      {
        id: 'BR001',
        name: 'Pune Main',
        portalUsers: 8,
        mobileUsers: 1240,
        requests: makeRequests(
          [12, 7, 4, 6, 4, 3, 2, 2, 4, 3, 2, 1, 7],
          [3, 2, 1, 2, 1, 1, 0, 1, 1, 1, 1, 0, 2],
        ),
      },

      {
        id: 'BR002',
        name: 'Camp',
        portalUsers: 5,
        mobileUsers: 980,
        requests: makeRequests(
          [8, 5, 3, 4, 3, 2, 1, 2, 3, 2, 2, 1, 5],
          [2, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
        ),
      },

      {
        id: 'BR003',
        name: 'Kothrud',
        portalUsers: 4,
        mobileUsers: 760,
        requests: makeRequests(
          [6, 4, 2, 3, 2, 2, 1, 1, 2, 1, 1, 1, 4],
          [1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        ),
      },

      {
        id: 'BR004',
        name: 'Hadapsar',
        portalUsers: 3,
        mobileUsers: 610,
        requests: makeRequests(
          [5, 3, 2, 2, 2, 1, 1, 1, 2, 1, 1, 0, 3],
          [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
        ),
      },
    ],
  },

  {
    code: 'demo-sahakari',
    name: 'Demo Sahakari Bank',

    branches: [
      {
        id: 'BR101',
        name: 'Mumbai Main',
        portalUsers: 9,
        mobileUsers: 1520,
        requests: makeRequests(
          [15, 8, 4, 7, 5, 3, 2, 2, 5, 3, 3, 2, 8],
          [4, 2, 1, 2, 2, 1, 1, 0, 2, 1, 1, 0, 2],
        ),
      },

      {
        id: 'BR102',
        name: 'Andheri',
        portalUsers: 6,
        mobileUsers: 1040,
        requests: makeRequests(
          [9, 5, 3, 4, 3, 2, 1, 1, 3, 2, 2, 1, 5],
          [2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
        ),
      },

      {
        id: 'BR103',
        name: 'Thane',
        portalUsers: 5,
        mobileUsers: 920,
        requests: makeRequests(
          [7, 4, 2, 3, 3, 2, 1, 1, 2, 2, 1, 1, 4],
          [2, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
        ),
      },
    ],
  },

  {
    code: 'nagar-coop',
    name: 'Nagar Co-op Bank',

    branches: [
      {
        id: 'BR201',
        name: 'Ahmednagar Main',
        portalUsers: 7,
        mobileUsers: 1180,
        requests: makeRequests(
          [10, 6, 3, 5, 4, 2, 2, 1, 4, 2, 2, 1, 6],
          [2, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 2],
        ),
      },

      {
        id: 'BR202',
        name: 'Shrirampur',
        portalUsers: 4,
        mobileUsers: 680,
        requests: makeRequests(
          [6, 3, 2, 3, 2, 1, 1, 1, 2, 1, 1, 1, 3],
          [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        ),
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Helper functions                                                            */
/* -------------------------------------------------------------------------- */

function aggregateBranches(branches: DemoBranch[]) {
  const requestMap = REQUEST_TYPES.reduce<
    Record<string, RequestMetric>
  >((acc, type) => {
    acc[type] = {
      total: 0,
      pending: 0,
    };

    return acc;
  }, {});

  let portalUsers = 0;
  let mobileUsers = 0;

  branches.forEach((branch) => {
    portalUsers += branch.portalUsers;
    mobileUsers += branch.mobileUsers;

    REQUEST_TYPES.forEach((type) => {
      requestMap[type].total += branch.requests[type]?.total ?? 0;
      requestMap[type].pending += branch.requests[type]?.pending ?? 0;
    });
  });

  const totalRequests = Object.values(requestMap).reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const pendingRequests = Object.values(requestMap).reduce(
    (sum, item) => sum + item.pending,
    0,
  );

  return {
    requestMap,
    portalUsers,
    mobileUsers,
    totalRequests,
    pendingRequests,
  };
}

function getDemoBank(
  bankCode: string,
  bankName?: string,
): DemoBankAnalytics {
  const normalizedCode = String(bankCode || '').toLowerCase();

  const found = DEMO_ANALYTICS.find(
    (bank) =>
      bank.code.toLowerCase() === normalizedCode ||
      bank.name.toLowerCase() === String(bankName || '').toLowerCase(),
  );

  return found ?? DEMO_ANALYTICS[0];
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export default function SuperAdminDashboard() {
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [bankOptions, setBankOptions] = useState<BankSummaryRow[]>([]);

  /*
   * Existing Allianza dashboard API.
   * DO NOT remove this.
   */
  const {
    data,
    loading,
    error,
    reload,
  } = useAsyncData(
    () =>
      dashboardService.getSuperAdminDashboard(
        selectedBankCode || undefined,
      ),
    [selectedBankCode],
  );

  /* ------------------------------------------------------------------------ */
  /* Bank dropdown                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!data) return;

    const apiBanks = Array.isArray(data.recentBanks)
      ? data.recentBanks
      : [];

    if (apiBanks.length > 0) {
      setBankOptions(apiBanks);
      return;
    }

    /*
     * If dashboard API does not return banks,
     * use existing bank master API.
     */
    void mastersService
      .listBanks({
        page: 1,
        pageSize: 100,
      })
      .then((result) => {
        const options: BankSummaryRow[] = (
          result.items ?? []
        ).map((bank) => ({
          id: bank.id,
          name: bank.name,
          code: bank.code,
          type: bank.type,
          branches: Number(bank.branches ?? 0),
          users: 0,
          status: 'active',
        }));

        if (options.length > 0) {
          setBankOptions(options);
        }
      })
      .catch(() => undefined);
  }, [data]);

  /* ------------------------------------------------------------------------ */
  /* Loading / error                                                          */
  /* ------------------------------------------------------------------------ */

  if (loading && !data) {
    return <FullPageLoader />;
  }

  if (!data) {
    return (
      <ErrorState
        message={
          error ?? 'Unable to load the dashboard.'
        }
        onRetry={reload}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* API data                                                                  */
  /* ------------------------------------------------------------------------ */

  const apiBanks = Array.isArray(data.recentBanks)
    ? data.recentBanks
    : [];

  const apiRequests = Array.isArray(data.requestsByBank)
    ? data.requestsByBank
    : [];

  const baseStats = Array.isArray(data.stats)
    ? data.stats
    : [];

  const getStatValue = (key: string) =>
    Number(
      baseStats.find((item) => item.key === key)?.value ?? 0,
    );

  /* ------------------------------------------------------------------------ */
  /* Selected bank                                                             */
  /* ------------------------------------------------------------------------ */

  const selectedBank =
    bankOptions.find(
      (bank) => bank.code === selectedBankCode,
    ) ??
    apiBanks.find(
      (bank) => bank.code === selectedBankCode,
    );

  /*
   * If no bank is selected:
   * show all banks.
   *
   * If selected:
   * show selected bank only.
   */
  const visibleBanks = selectedBank
    ? apiBanks.filter(
        (bank) => bank.code === selectedBank.code,
      )
    : apiBanks;

  /* ------------------------------------------------------------------------ */
  /* Component-level fallback analytics                                        */
  /* ------------------------------------------------------------------------ */

  /**
   * This is the important part.
   *
   * API may return:
   *
   * branches = 0
   * users = 0
   * requests = 0
   *
   * because backend does not yet expose those analytics.
   *
   * We DON'T replace the whole API.
   * We only use dummy analytics when those values are missing.
   */

  const demoBank = getDemoBank(
    selectedBank?.code ??
      apiBanks[0]?.code ??
      '',
    selectedBank?.name ??
      apiBanks[0]?.name,
  );

  const demoAggregate = aggregateBranches(
    demoBank.branches,
  );

  /* ------------------------------------------------------------------------ */
  /* Branch / user analytics                                                   */
  /* ------------------------------------------------------------------------ */

  const apiBranchCount = visibleBanks.reduce(
    (sum, bank) =>
      sum + Number(bank.branches || 0),
    0,
  );

  const apiUserCount = visibleBanks.reduce(
    (sum, bank) =>
      sum + Number(bank.users || 0),
    0,
  );

  /*
   * API values first.
   * Dummy values only when API gives zero/missing data.
   */
  const totalBranches =
    apiBranchCount > 0
      ? apiBranchCount
      : demoAggregate.branches
          ? demoAggregate.branches.length
          : 0;

  const totalUsers =
    apiUserCount > 0
      ? apiUserCount
      : demoAggregate.portalUsers;

  /* ------------------------------------------------------------------------ */
  /* Request analytics                                                         */
  /* ------------------------------------------------------------------------ */

  const apiTotalRequests = selectedBank
    ? apiRequests
        .filter(
          (item) =>
            item.label === selectedBank.name,
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.count || 0),
          0,
        )
    : getStatValue('requests');

  const totalRequests =
    apiTotalRequests > 0
      ? apiTotalRequests
      : demoAggregate.totalRequests;

  const apiPendingRequests =
    getStatValue('pending');

  const pendingRequests =
    apiPendingRequests > 0
      ? apiPendingRequests
      : demoAggregate.pendingRequests;

  /* ------------------------------------------------------------------------ */
  /* Cards                                                                     */
  /* ------------------------------------------------------------------------ */

  const displayStats: StatCardData[] = [
    {
      key: 'banks',
      label: 'No. of banks',
      value: selectedBank
        ? '1'
        : formatNumber(
            apiBanks.length ||
              getStatValue('banks') ||
              bankOptions.length ||
              1,
          ),
      helper: selectedBank
        ? 'Selected bank'
        : 'Onboarded banks',
      helperTone: 'success',
      icon: 'banks',
    },

    {
      key: 'branches',
      label: 'Total branches',
      value: formatNumber(totalBranches),
      helper: selectedBank
        ? 'Selected bank branches'
        : 'Across all banks',
      helperTone: 'neutral',
      icon: 'branches',
    },

    {
      key: 'users',
      label: 'Application users',
      value: formatNumber(totalUsers),
      helper: selectedBank
        ? 'Selected bank users'
        : 'Across all banks',
      helperTone: 'success',
      icon: 'users',
    },

    {
      key: 'pending',
      label: 'Pending requests',
      value: formatNumber(pendingRequests),
      helper: 'Across request modules',
      helperTone: 'warning',
      icon: 'requests',
    },

    {
      key: 'requests',
      label: 'Total requests',
      value: formatNumber(totalRequests),
      helper: selectedBank
        ? 'Selected bank requests'
        : 'Across all banks',
      helperTone: 'neutral',
      icon: 'requests',
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* Requests by bank                                                          */
  /* ------------------------------------------------------------------------ */

  let requestBars = apiRequests
    .map((item) => ({
      label: item.label,
      count: Number(item.count || 0),
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  /*
   * If API does not provide request analytics,
   * generate request analytics from component-level demo data.
   */
  if (requestBars.length === 0) {
    if (selectedBank) {
      requestBars = [
        {
          label: selectedBank.name,
          count: demoAggregate.totalRequests,
        },
      ];
    } else {
      requestBars = DEMO_ANALYTICS.map(
        (bank) => ({
          label: bank.name,
          count: aggregateBranches(
            bank.branches,
          ).totalRequests,
        }),
      ).sort((a, b) => b.count - a.count);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Branch analytics                                                          */
  /* ------------------------------------------------------------------------ */

  const branchBars = selectedBank
    ? demoBank.branches.map((branch) => ({
        label: branch.name,
        count: Object.values(
          branch.requests,
        ).reduce(
          (sum, item) =>
            sum + item.total,
          0,
        ),
      }))
    : DEMO_ANALYTICS.map((bank) => ({
        label: bank.name,
        count: bank.branches.length,
      }));

  /* ------------------------------------------------------------------------ */
  /* User analytics                                                            */
  /* ------------------------------------------------------------------------ */

  const userBars = selectedBank
    ? demoBank.branches.map((branch) => ({
        label: branch.name,
        count: branch.portalUsers,
      }))
    : DEMO_ANALYTICS.map((bank) => ({
        label: bank.name,
        count: aggregateBranches(
          bank.branches,
        ).portalUsers,
      }));

  /* ------------------------------------------------------------------------ */
  /* Request type breakdown                                                    */
  /* ------------------------------------------------------------------------ */

  const requestTypeBars = Object.entries(
    demoAggregate.requestMap,
  )
    .map(([label, metric]) => ({
      label,
      count: metric.total,
      pending: metric.pending,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const selectedBankName =
    selectedBank?.name ??
    demoBank.name ??
    'All banks';

  /* ------------------------------------------------------------------------ */
  /* UI                                                                        */
  /* ------------------------------------------------------------------------ */

  return (
    <Box>
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <PageHeader
        title="Dashboard"
        subtitle="Banks, application users and requests across the platform"
        actions={
          <>
            <Select
              size="small"
              displayEmpty
              value={selectedBankCode}
              onChange={(e) =>
                setSelectedBankCode(
                  e.target.value,
                )
              }
              inputProps={{
                'aria-label':
                  'Filter by bank',
              }}
              sx={{
                minWidth: 250,
                fontWeight: 600,
              }}
            >
              <MenuItem value="">
                All banks
              </MenuItem>

              {bankOptions.map((bank) => (
                <MenuItem
                  key={bank.id}
                  value={bank.code}
                >
                  {bank.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              component={RouterLink}
              to={
                PATHS.MASTERS.BANK_MASTER
              }
              variant="contained"
              startIcon={
                <AccountBalanceOutlinedIcon />
              }
            >
              Manage banks
            </Button>
          </>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* KPI CARDS - SAME ROW                                                 */}
      {/* ------------------------------------------------------------------ */}

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          mb: 3,

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
        }}
      >
        {displayStats.map((stat) => (
          <StatCard
            key={stat.key}
            data={stat}
          />
        ))}
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* ANALYTICS ROW                                                        */}
      {/* ------------------------------------------------------------------ */}

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          mb: 3,

          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, minmax(0, 1fr))',
          },
        }}
      >
        <BarListCard
          title={
            selectedBank
              ? `${selectedBankName} — Requests`
              : 'Requests by bank'
          }
          items={requestBars}
        />

        <BarListCard
          title={
            selectedBank
              ? `${selectedBankName} — Branch requests`
              : 'Branches by bank'
          }
          items={branchBars}
        />
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* BANK PERFORMANCE + QUICK ACTIONS                                    */}
      {/* ------------------------------------------------------------------ */}

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          mb: 3,

          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 2fr) minmax(0, 1fr)',
          },

          alignItems: 'start',
        }}
      >
        {/* BANK PERFORMANCE */}

        <Paper
          variant="outlined"
          className="app-card"
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 2.5,
              display: 'flex',
              justifyContent:
                'space-between',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="subtitle1">
                Bank performance
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Branches and application
                users for{' '}
                {selectedBank
                  ? selectedBankName
                  : 'all onboarded banks'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <BusinessOutlinedIcon
                  fontSize="small"
                />

                {formatNumber(
                  totalBranches,
                )}{' '}
                branches
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <PeopleAltOutlinedIcon
                  fontSize="small"
                />

                {formatNumber(
                  totalUsers,
                )}{' '}
                users
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Bank
                  </TableCell>

                  <TableCell>
                    Code
                  </TableCell>

                  <TableCell>
                    Type
                  </TableCell>

                  <TableCell align="right">
                    Branches
                  </TableCell>

                  <TableCell align="right">
                    App users
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleBanks.length > 0
                  ? visibleBanks.map(
                      (bank) => (
                        <TableRow
                          key={bank.id}
                          hover
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {bank.name}
                          </TableCell>

                          <TableCell>
                            {bank.code}
                          </TableCell>

                          <TableCell>
                            {bank.type}
                          </TableCell>

                          <TableCell align="right">
                            {formatNumber(
                              Number(
                                bank.branches ||
                                  (
                                    selectedBank
                                      ? demoBank.branches.length
                                      : 0
                                  ),
                              ),
                            )}
                          </TableCell>

                          <TableCell align="right">
                            {formatNumber(
                              Number(
                                bank.users ||
                                  (
                                    selectedBank
                                      ? demoAggregate.portalUsers
                                      : 0
                                  ),
                              ),
                            )}
                          </TableCell>

                          <TableCell>
                            <StatusChip
                              status={
                                bank.status
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ),
                    )
                  : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                      >
                        No bank data available.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* QUICK ACTIONS */}

        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
          }}
        >
          <QuickActionsCard
            actions={ACTIONS}
          />

          <BarListCard
            title="Application users by bank"
            items={userBars}
          />
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* REQUEST TYPE BREAKDOWN                                              */}
      {/* ------------------------------------------------------------------ */}

      <Paper
        variant="outlined"
        className="app-card"
        sx={{
          p: 2.5,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <DescriptionOutlinedIcon color="primary" />

          <Box>
            <Typography variant="subtitle1">
              Request type breakdown
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              All Request Handling modules combined
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
          }}
        >
          {requestTypeBars
            .slice(0, 8)
            .map((item) => {
              const max =
                requestTypeBars[0]
                  ?.count || 1;

              return (
                <Box
                  key={item.label}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(0, 1fr) auto',
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {item.label}
                    </Typography>

                    <Box
                      sx={{
                        height: 8,
                        mt: 0.5,
                        borderRadius: 99,
                        bgcolor:
                          'action.hover',
                        overflow:
                          'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${
                            (item.count /
                              max) *
                            100
                          }%`,
                          height: '100%',
                          bgcolor:
                            'primary.main',
                          borderRadius: 99,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={800}
                    >
                      {item.count}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="warning.dark"
                    >
                      {item.pending}{' '}
                      pending
                    </Typography>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Paper>

      {/* ------------------------------------------------------------------ */}
      {/* SMALL SUMMARY                                                        */}
      {/* ------------------------------------------------------------------ */}

      <Paper
        variant="outlined"
        className="app-card"
        sx={{
          p: 2.5,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
          }}
        >
          <DescriptionOutlinedIcon color="primary" />

          <Typography variant="subtitle1">
            Request activity
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {selectedBank
            ? `${formatNumber(
                totalRequests,
              )} requests are associated with ${selectedBankName}.`
            : `${formatNumber(
                totalRequests,
              )} requests are currently represented across the onboarded banks.`}
        </Typography>
      </Paper>
    </Box>
  );
}