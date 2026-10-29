import { lazy, Suspense, type ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import FullPageLoader from '@/components/common/FullPageLoader';
import DashboardLayout from '@/layouts/DashboardLayout';
import ComingSoonPage from '@/pages/errors/ComingSoonPage';
import NotFoundPage from '@/pages/errors/NotFoundPage';
import LoginPage from '@/pages/auth/LoginPage';
import { getAllNavRoutes } from './navigation';
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

const RequestValidationIndex = lazy(() => import('@/pages/request-validation/index'));
const PaymentsPage = lazy(() => import('@/pages/request-validation/payments'));
const OpeningAccountsPage = lazy(() => import('@/pages/request-validation/opening-accounts'));
const ClosingAccountsPage = lazy(() => import('@/pages/request-validation/closing-accounts'));
const StandingInstructionsPage = lazy(() => import('@/pages/request-validation/standing-instructions'));
const StopPaymentPage = lazy(() => import('@/pages/request-validation/stop-payment'));
const RequestLeadManagementPage = lazy(() => import('@/pages/request-validation/lead-management'));


// Pages that are really built. Everything else in NAV_ITEMS shows a "Coming soon" placeholder.
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const BranchesPage = lazy(() => import('@/pages/branches/BranchesPage'));
const UserManagement = lazy(() => import('@/pages/users-management/index'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));
const UploadImagesPage = lazy(() => import('@/pages/upload-images/UploadImagesPage'));
const BankPage = lazy(() => import('@/pages/bank/BankPage'));

const BUILT_PAGES: Record<string, ReactElement> = {
  [PATHS.banks]: <BankPage />,
  [PATHS.dashboard]: <DashboardPage />,
  [PATHS.branches]: <BranchesPage />,
  [PATHS.userManagement]: <UserManagement />,
  [PATHS.customers]: <CustomersPage />,
  [PATHS.uploadImages]: <UploadImagesPage />,
  [PATHS.serviceRequests]: <ServiceRequestsPage />,
  [PATHS.leadEnquiries]: <LeadEnquiriesPage />,
  [PATHS.reports]: <ReportsPage />,
  [PATHS.pushNotifications]: <PushNotificationsPage />,
  [PATHS.deviceReset]: <DeviceResetPage />,
  [PATHS.banners]: <BannersPage />,
  [PATHS.requestValidation]: <RequestValidationIndex />,
  [PATHS.requestValidationPayments]: <PaymentsPage />,
  [PATHS.requestValidationOpeningAccounts]: <OpeningAccountsPage />,
  [PATHS.requestValidationClosingAccounts]: <ClosingAccountsPage />,
  [PATHS.requestValidationStandingInstructions]: <StandingInstructionsPage />,
  [PATHS.requestValidationStopPayment]: <StopPaymentPage />,
  [PATHS.requestValidationLeadManagement]: <RequestLeadManagementPage />,
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
            {getAllNavRoutes().map((item) => (
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
