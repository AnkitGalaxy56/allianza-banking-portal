import { lazy, Suspense, type ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import FullPageLoader from '@/components/common/FullPageLoader';
import DashboardLayout from '@/layouts/DashboardLayout';
import ComingSoonPage from '@/pages/errors/ComingSoonPage';
import NotFoundPage from '@/pages/errors/NotFoundPage';
import LoginPage from '@/pages/auth/LoginPage';
import { NAV_ITEMS } from './navigation';
import { PATHS } from './paths';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import RoleGuard from './RoleGuard';
import OtpVerificationPage from '@/pages/auth/OtpVerificationPage';

const ServiceRequestsPage = lazy(() => import('@/pages/service-requests/ServiceRequestsPage'));
const LeadEnquiriesPage = lazy(() => import('@/pages/lead-enquiries/LeadEnquiriesPage'));
const PushNotificationsPage = lazy(() => import('@/pages/push-notifications/PushNotificationsPage'));
const DeviceResetPage = lazy(() => import('@/pages/device-reset/DeviceResetPage'));
const BannersPage = lazy(() => import('@/pages/banners-content/BannersPage'));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'));

// Pages that are really built. Everything else in NAV_ITEMS shows a "Coming soon" placeholder.
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const BranchesPage = lazy(() => import('@/pages/branches/BranchesPage'));
const UserManagement = lazy(() => import('@/pages/users-management/index'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));

const BUILT_PAGES: Record<string, ReactElement> = {
  [PATHS.dashboard]: <DashboardPage />,
  [PATHS.branches]: <BranchesPage />,
  [PATHS.userManagement]: <UserManagement />,
  [PATHS.customers]: <CustomersPage />,
  [PATHS.serviceRequests]: <ServiceRequestsPage />,
  [PATHS.leadEnquiries]: <LeadEnquiriesPage />,
  [PATHS.reports]: <ReportsPage />,
  [PATHS.pushNotifications]: <PushNotificationsPage />,
  [PATHS.deviceReset]: <DeviceResetPage />,
  [PATHS.banners]: <BannersPage />,
};

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
       
       
        <Route element={<PublicOnlyRoute />}>
          <Route path={PATHS.login} element={<LoginPage />} />
        </Route>

        <Route
          path={PATHS.otp}
          element={<OtpVerificationPage />}
        />


        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.dashboard} replace />} />
            {NAV_ITEMS.map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <RoleGuard allowed={item.roles}>
                    {BUILT_PAGES[item.path] ?? <ComingSoonPage title={item.label} />}
                  </RoleGuard>
                }
              />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
