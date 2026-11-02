import type { SvgIconComponent } from '@mui/icons-material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
// import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
// import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import { ROLES, type Role } from '@/config/roles';
import { PATHS } from './paths';

export interface NavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
  /** Roles that can see this menu item and access its route. */
  roles: Role[];
  /** Optional nested sidebar links. */
  children?: NavItem[];
}

const { SUPER_ADMIN, BANK_ADMIN, BANK_USER } = ROLES;
const ALL_BANK_ROLES: Role[] = [SUPER_ADMIN, BANK_ADMIN, BANK_USER];

/**
 * Single source of truth for sidebar navigation and generated protected routes.
 * Nested items appear as collapsible submenu links and also receive protected routes.
 */



//existing 

// export const NAV_ITEMS: NavItem[] = [


//   {
//     label: 'Dashboard',
//     path: PATHS.dashboard,
//     icon: GridViewOutlinedIcon,
//     roles: ALL_BANK_ROLES,
//   },
//   {
//     label: 'Customer Onboarding',
//     path: PATHS.customerOnboarding,
//     icon: PersonAddAlt1OutlinedIcon,
//     roles: [SUPER_ADMIN],
//   },

//   // Allianza admin
//   {
//     label: 'Bank Management',
//     path: PATHS.banks,
//     icon: AccountBalanceOutlinedIcon,
//     roles: [SUPER_ADMIN],
//   },

//   // Request validation and its submenu pages
//   {
//     label: 'Request Validation',
//     path: PATHS.requestValidation,
//     icon: FactCheckOutlinedIcon,
//     roles: ALL_BANK_ROLES,
//     children: [
//       {
//         label: 'Payments',
//         path: PATHS.requestValidationPayments,
//         icon: PaymentsOutlinedIcon,
//         roles: ALL_BANK_ROLES,

//       },
//       {
//         label: 'Opening Accounts',
//         path: PATHS.requestValidationOpeningAccounts,
//         icon: AccountBalanceOutlinedIcon,
//         roles: ALL_BANK_ROLES,
//       },
//       {
//         label: 'Closing Account',
//         path: PATHS.requestValidationClosingAccounts,
//         icon: CancelPresentationOutlinedIcon,
//         roles: ALL_BANK_ROLES,
//       },
//       {
//         label: 'Lead Management',
//         path: PATHS.requestValidationLeadManagement,
//         icon: TrendingUpOutlinedIcon,
//         roles: ALL_BANK_ROLES,
//       },
//       {
//         label: 'Stop Payment',
//         path: PATHS.requestValidationStopPayment,
//         icon: BlockOutlinedIcon,
//         roles: ALL_BANK_ROLES,
//       },
//     ],
//   },

//   // Bank admin
//   {
//     label: 'Branches',
//     path: PATHS.branches,
//     icon: AccountBalanceOutlinedIcon,
//     roles: [BANK_ADMIN],
//   },
//   {
//     label: 'User Management',
//     path: PATHS.userManagement,
//     icon: ShieldOutlinedIcon,
//     roles: [BANK_ADMIN, SUPER_ADMIN],

//   },

//   // Bank admin + bank employee
//   {
//     label: 'Customers',
//     path: PATHS.customers,
//     icon: PeopleAltOutlinedIcon,
//     roles: [BANK_ADMIN, BANK_USER],
//   },
//   {
//     label: 'Service Requests',
//     path: PATHS.serviceRequests,
//     icon: DescriptionOutlinedIcon,
//     roles: [BANK_ADMIN, BANK_USER],
//   },
//   {
//     label: 'Lead Enquiries',
//     path: PATHS.leadEnquiries,
//     icon: AttachMoneyOutlinedIcon,
//     roles: [BANK_ADMIN, BANK_USER],
//   },

//   // Shared admin tools
//   {
//     label: 'Reports',
//     path: PATHS.reports,
//     icon: BarChartOutlinedIcon,
//     roles: [SUPER_ADMIN, BANK_ADMIN],
//   },
//   {
//     label: 'Push Notifications',
//     path: PATHS.pushNotifications,
//     icon: NotificationsNoneOutlinedIcon,
//     roles: [SUPER_ADMIN, BANK_ADMIN],
//   },
//   {
//     label: 'Device Reset',
//     path: PATHS.deviceReset,
//     icon: SmartphoneOutlinedIcon,
//     roles: [SUPER_ADMIN, BANK_ADMIN],
//   },
//   {
//     label: 'Banners & Content',
//     path: PATHS.banners,
//     icon: ImageOutlinedIcon,
//     roles: [BANK_ADMIN],
//   },
//   {
//     label: 'Upload Image',
//     path: PATHS.uploadImages,
//     icon: ImageOutlinedIcon,
//     roles: [SUPER_ADMIN],
//   },
// ];


export const NAV_ITEMS: NavItem[] = [
  // 1. Dashboard
  {
    label: 'Dashboard',
    path: PATHS.dashboard,
    icon: GridViewOutlinedIcon,
    roles: ALL_BANK_ROLES,
  },

  
  // 3. Request Handling (replaces Request Validation)
  {
    label: 'Request Handling',
    path: PATHS.REQUEST_HANDLING.ROOT,
    icon: FactCheckOutlinedIcon,
    roles: ALL_BANK_ROLES,
    children: [
      {
        label: 'Payments',
        path: PATHS.REQUEST_HANDLING.PAYMENTS,
        icon: PaymentsOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Cheque Book',
        path: PATHS.REQUEST_HANDLING.CHEQUE_BOOK,
        icon: DescriptionOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Stop Payment',
        path: PATHS.REQUEST_HANDLING.STOP_PAYMENT,
        icon: BlockOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'FD Opening',
        path: PATHS.REQUEST_HANDLING.FD_OPENING,
        icon: AccountBalanceOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'RD Opening',
        path: PATHS.REQUEST_HANDLING.RD_OPENING,
        icon: AccountBalanceOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'FD / RD Closing',
        path: PATHS.REQUEST_HANDLING.FD_RD_CLOSING,
        icon: CancelPresentationOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Locker Application',
        path: PATHS.REQUEST_HANDLING.LOCKER_APPLICATION,
        icon: DescriptionOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Standing Instructions',
        path: PATHS.REQUEST_HANDLING.STANDING_INSTRUCTIONS,
        icon: DescriptionOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Fresh Loan Application',
        path: PATHS.REQUEST_HANDLING.FRESH_LOAN_APPLICATION,
        icon: AttachMoneyOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Loan EMI Payment',
        path: PATHS.REQUEST_HANDLING.LOAN_EMI_PAYMENT,
        icon: PaymentsOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },

      // Existing request screens retained
      // {
      //   label: 'Opening Accounts / Customer Onboarding',
      //   path: PATHS.customerOnboarding,
      //   icon: PersonAddAlt1OutlinedIcon,
      //   roles: ALL_BANK_ROLES,
      // },
      // {
      //   label: 'Lead Management',
      //   path: PATHS.REQUEST_HANDLING.LEAD_MANAGEMENT,
      //   icon: TrendingUpOutlinedIcon,
      //   roles: ALL_BANK_ROLES,
      // },
    ],
  },

  // 4. Masters
  {
    label: 'Masters',
    path: '/masters',
    icon: AccountBalanceOutlinedIcon,
    roles: ALL_BANK_ROLES,
    children: [
      {
        label: 'Bank Master',
        path: PATHS.MASTERS.BANK_MASTER,
        icon: AccountBalanceOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Branch Master',
        path: PATHS.MASTERS.BRANCH_MASTER,
        icon: AccountBalanceOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
    ],
  },

  // 5. Mobile Utilities
  {
    label: 'Mobile Utilities',
    path: '/mobile-utilities',
    icon: SmartphoneOutlinedIcon,
    roles: ALL_BANK_ROLES,
    children: [
      {
        label: 'Image Uploading',
        path: PATHS.MOBILE_UTILITIES.IMAGE_UPLOADING,
        icon: ImageOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Push Notification',
        path: PATHS.MOBILE_UTILITIES.PUSH_NOTIFICATION,
        icon: NotificationsNoneOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Device Reset',
        path: PATHS.MOBILE_UTILITIES.DEVICE_RESET,
        icon: SmartphoneOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
    ],
  },

  // 6. User Management
  {
    label: 'User Management',
    path: PATHS.USER_MANAGEMENT.ROOT,
    icon: ShieldOutlinedIcon,
    roles: ALL_BANK_ROLES,
    children: [
      {
        label: 'User Master',
        path: PATHS.USER_MANAGEMENT.USER_MASTER,
        icon: ManageAccountsOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Assign Password',
        path: PATHS.USER_MANAGEMENT.ASSIGN_PASSWORD,
        icon: ShieldOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
    ],
  },

  // 7. Reports
  {
    label: 'Reports',
    path: PATHS.reports,
    icon: BarChartOutlinedIcon,
    roles: ALL_BANK_ROLES,
    children: [
      {
        label: 'Requests',
        path: PATHS.REPORTS.REQUESTS,
        icon: DescriptionOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'User Master',
        path: PATHS.REPORTS.USER_MASTER,
        icon: ManageAccountsOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Notification',
        path: PATHS.REPORTS.NOTIFICATION,
        icon: NotificationsNoneOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
    ],
  },

  // 8. Settings
  {
    label: 'Settings',
    path: '/settings',
    icon: ManageAccountsOutlinedIcon,
    roles: ALL_BANK_ROLES,
    children: [
      {
        label: 'Change Password',
        path: PATHS.SETTINGS.CHANGE_PASSWORD,
        icon: ShieldOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Profile',
        path: PATHS.SETTINGS.PROFILE,
        icon: ManageAccountsOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Roles and Access Control',
        path: PATHS.SETTINGS.ROLES_ACCESS_CONTROL,
        icon: ShieldOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
      {
        label: 'Change Colour Theme',
        path: '/settings/change-colour-theme',
        icon: ManageAccountsOutlinedIcon,
        roles: ALL_BANK_ROLES,
      },
    ],
  },

  // --------------------------------------------------
  // EXISTING MENUS — retained below the new menus
  // --------------------------------------------------



  // {
  //   label: 'Branches',
  //   path: PATHS.branches,
  //   icon: AccountBalanceOutlinedIcon,
  //   roles: [BANK_ADMIN],
  // },

  // {
  //   label: 'Customers',
  //   path: PATHS.customers,
  //   icon: PeopleAltOutlinedIcon,
  //   roles: [BANK_ADMIN, BANK_USER],
  // },

  // {
  //   label: 'Service Requests',
  //   path: PATHS.serviceRequests,
  //   icon: DescriptionOutlinedIcon,
  //   roles: [BANK_ADMIN, BANK_USER],
  // },

  // {
  //   label: 'Lead Enquiries',
  //   path: PATHS.leadEnquiries,
  //   icon: AttachMoneyOutlinedIcon,
  //   roles: [BANK_ADMIN, BANK_USER],
  // },

  {
    label: 'Banners & Content',
    path: PATHS.banners,
    icon: ImageOutlinedIcon,
    roles: [SUPER_ADMIN, BANK_ADMIN, BANK_USER],
  },

 
];

const filterItemsForRole = (items: NavItem[], role: Role): NavItem[] =>
  items.flatMap((item) => {
    if (!item.roles.includes(role)) {
      return [];
    }

    const children = item.children
      ? filterItemsForRole(item.children, role)
      : undefined;

    // Hide a parent if all its nested items are inaccessible and it has no route.
    return [{ ...item, ...(children ? { children } : {}) }];
  });

export const getNavForRole = (role: Role): NavItem[] =>
  filterItemsForRole(NAV_ITEMS, role);


export const getAllNavRoutes = (items: NavItem[] = NAV_ITEMS): NavItem[] => {
  const routesByPath = new Map<string, NavItem>();

  const visit = (navItems: NavItem[]) => {
    navItems.forEach((item) => {
      const existing = routesByPath.get(item.path);

      if (existing) {
        routesByPath.set(item.path, {
          ...existing,
          roles: Array.from(new Set([...existing.roles, ...item.roles])),
        });
      } else {
        routesByPath.set(item.path, item);
      }

      if (item.children?.length) {
        visit(item.children);
      }
    });
  };

  visit(items);
  return Array.from(routesByPath.values());
};
