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
// const ProfilePage = lazy(() => import('@/pages/profile'));
// const ChangePasswordPage = lazy(() => import('@/pages/change-password'));
const RolesAccessControlPage = lazy(() => import('@/pages/settings/roles-access-control'));

const RequestValidationIndex = lazy(() => import('@/pages/request-validation/index'));
const PaymentsPage = lazy(() => import('@/pages/request-handling/rtgs-neft-imps'));
const OpeningAccountsPage = lazy(() => import('@/pages/request-validation/opening-accounts'));
const ClosingAccountsPage = lazy(() => import('@/pages/request-validation/closing-accounts'));
const StandingInstructionsPage = lazy(() => import('@/pages/request-validation/standing-instructions'));
const StopPaymentPage = lazy(() => import('@/pages/request-handling/stop-payment'));
const RequestLeadManagementPage = lazy(() => import('@/pages/request-validation/lead-management'));
const ChequeBookPage = lazy(() => import('@/pages/request-handling/cheque-book'));
const FDOpeningPage = lazy(() => import('@/pages/request-handling/fd-opening'));
const RDOpeningPage = lazy(() => import('@/pages/request-handling/rd-opening'));
const LockerApplicationPage = lazy(() => import('@/pages/request-handling/locker-application'));
const StandingInstructionsRequestPage = lazy(() => import('@/pages/request-handling/standing-instructions'));
const FreshLoanApplicationPage = lazy(() => import('@/pages/request-handling/fresh-loan-application'));
const LoanEMIPaymentPage = lazy(() => import('@/pages/request-handling/loan-emi-payment'));


// Pages that are really built. Everything else in NAV_ITEMS shows a "Coming soon" placeholder.
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const BranchesPage = lazy(() => import('@/pages/branches/BranchesPage'));
const UserManagement = lazy(() => import('@/pages/users-management/index'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));
const UploadImagesPage = lazy(() => import('@/pages/upload-images/UploadImagesPage'));
const CustomersOnboarding = lazy(() => import('@/pages/customer-onboarding/CustomerOnboardingPage'));
const BankPage = lazy(() => import('@/pages/banks-management/BankPage'));

const BUILT_PAGES: Record<string, ReactElement> = {
  [PATHS.USER_MANAGEMENT.ROOT]: <UserManagement />,
  [PATHS.USER_MANAGEMENT.USER_MASTER]: <UserManagement />,
  [PATHS.MASTERS.BANK_MASTER]: <BankPage />,
  [PATHS.AUTH.DASHBOARD]: <DashboardPage />,


  // [PATHS.SETTINGS.PROFILE]: <ProfilePage />,
  // [PATHS.SETTINGS.CHANGE_PASSWORD]: <ChangePasswordPage />,
  [PATHS.BRANCHES.ROOT]: <BranchesPage />,
  // [PATHS.USER_MANAGEMENT.ROOT]: <UserManagement />,
  [PATHS.CUSTOMERS.ROOT]: <CustomersPage />,
  [PATHS.UPLOAD_IMAGES.ROOT]: <UploadImagesPage />,
  [PATHS.SERVICE_REQUESTS.ROOT]: <ServiceRequestsPage />,
  [PATHS.LEAD_ENQUIRIES.ROOT]: <LeadEnquiriesPage />,
  [PATHS.REPORTS.ROOT]: <ReportsPage />,
  [PATHS.SETTINGS.ROLES_ACCESS_CONTROL]: <RolesAccessControlPage />,
  [PATHS.PUSH_NOTIFICATIONS.ROOT]: <PushNotificationsPage />,
  [PATHS.DEVICE_RESET.ROOT]: <DeviceResetPage />,
  [PATHS.BANNERS.ROOT]: <BannersPage />,
  [PATHS.REQUEST_VALIDATION.ROOT]: <RequestValidationIndex />,
  [PATHS.REQUEST_VALIDATION.PAYMENTS]: <PaymentsPage />,
  [PATHS.REQUEST_VALIDATION.OPENING_ACCOUNTS]: <OpeningAccountsPage />,
  [PATHS.REQUEST_VALIDATION.CLOSING_ACCOUNTS]: <ClosingAccountsPage />,
  [PATHS.REQUEST_VALIDATION.STANDING_INSTRUCTIONS]: <StandingInstructionsPage />,
  [PATHS.REQUEST_VALIDATION.STOP_PAYMENT]: <StopPaymentPage />,
  [PATHS.REQUEST_VALIDATION.LEAD_MANAGEMENT]: <RequestLeadManagementPage />,
  [PATHS.REQUEST_HANDLING.CHEQUE_BOOK]: <ChequeBookPage />,
  [PATHS.REQUEST_HANDLING.FD_OPENING]: <FDOpeningPage />,
  [PATHS.REQUEST_HANDLING.RD_OPENING]: <RDOpeningPage />,
  [PATHS.REQUEST_HANDLING.LOCKER_APPLICATION]: <LockerApplicationPage />,
  [PATHS.REQUEST_HANDLING.STANDING_INSTRUCTIONS]: <StandingInstructionsRequestPage />,
  [PATHS.REQUEST_HANDLING.FRESH_LOAN_APPLICATION]: <FreshLoanApplicationPage />,
  [PATHS.REQUEST_HANDLING.LOAN_EMI_PAYMENT]: <LoanEMIPaymentPage />,
  [PATHS.REQUEST_HANDLING.CUSTOMER_ONBOARDING]: <CustomersOnboarding />
,
};

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>


        <Route element={<PublicOnlyRoute />}>
          <Route path={PATHS.AUTH.LOGIN} element={<LoginPage />} />
        </Route>

        <Route
          path={PATHS.AUTH.OTP}
          element={<OtpVerificationPage />}
        />


        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.AUTH.DASHBOARD} replace />} />
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
