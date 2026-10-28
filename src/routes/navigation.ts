import type { SvgIconComponent } from '@mui/icons-material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import { ROLES, type Role } from '@/config/roles';
import { PATHS } from './paths';

export interface NavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
  /** Roles that can see this menu item AND open this route */
  roles: Role[];
}

const { SUPER_ADMIN, BANK_ADMIN, BANK_USER } = ROLES;

/**
 * The single source of truth for the sidebar menu AND the route table (see AppRoutes.tsx).
 * Add an item here -> it appears in the menu and gets a protected route automatically.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: PATHS.dashboard, icon: GridViewOutlinedIcon, roles: [SUPER_ADMIN, BANK_ADMIN, BANK_USER] },

  // Allianza admin
  { label: 'Bank Management', path: PATHS.banks, icon: AccountBalanceOutlinedIcon, roles: [SUPER_ADMIN] },
  // { label: 'User Management', path: PATHS.users, icon: ManageAccountsOutlinedIcon, roles: [SUPER_ADMIN] },

  // Bank admin
  { label: 'Branches', path: PATHS.branches, icon: AccountBalanceOutlinedIcon, roles: [BANK_ADMIN] },
  { label: 'User Management', path: PATHS.branchUsers, icon: ShieldOutlinedIcon, roles: [BANK_ADMIN,SUPER_ADMIN] },

  // Bank admin + bank employee
  { label: 'Customers', path: PATHS.customers, icon: PeopleAltOutlinedIcon, roles: [BANK_ADMIN, BANK_USER] },
  { label: 'Service Requests', path: PATHS.serviceRequests, icon: DescriptionOutlinedIcon, roles: [BANK_ADMIN, BANK_USER] },
  { label: 'Lead Enquiries', path: PATHS.leadEnquiries, icon: AttachMoneyOutlinedIcon, roles: [BANK_ADMIN, BANK_USER] },

  // Shared admin tools
  { label: 'Reports', path: PATHS.reports, icon: BarChartOutlinedIcon, roles: [SUPER_ADMIN, BANK_ADMIN] },
  { label: 'Push Notifications', path: PATHS.pushNotifications, icon: NotificationsNoneOutlinedIcon, roles: [SUPER_ADMIN, BANK_ADMIN] },
  { label: 'Device Reset', path: PATHS.deviceReset, icon: SmartphoneOutlinedIcon, roles: [SUPER_ADMIN, BANK_ADMIN] },
  { label: 'Banners & Content', path: PATHS.banners, icon: ImageOutlinedIcon, roles: [BANK_ADMIN] },
  { label: 'Upload Image', path: PATHS.uploadImages, icon: ImageOutlinedIcon, roles: [SUPER_ADMIN] },
];

export const getNavForRole = (role: Role): NavItem[] =>
  NAV_ITEMS.filter((item) => item.roles.includes(role));












// import type { SvgIconComponent } from '@mui/icons-material';

// import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
// import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
// import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
// import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
// import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
// import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
// import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
// import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
// import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
// import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
// import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';

// import { ROLES, type Role } from '@/config/roles';
// import { PATHS } from './paths';

// export interface NavItem {
//   label: string;
//   path?: string;
//   icon: SvgIconComponent;
//   roles: Role[];
//   children?: NavItem[];
// }

// const { SUPER_ADMIN, BANK_ADMIN, BANK_USER } = ROLES;

// export const NAV_ITEMS: NavItem[] = [
//   {
//     label: 'Dashboard',
//     path: PATHS.dashboard,
//     icon: GridViewOutlinedIcon,
//     roles: [SUPER_ADMIN, BANK_ADMIN, BANK_USER],
//   },

//   // Allianza platform administration
//   {
//     label: 'Platform Management',
//     icon: AccountBalanceOutlinedIcon,
//     roles: [SUPER_ADMIN],
//     children: [
//       {
//         label: 'Bank Management',
//         path: PATHS.banks,
//         icon: AccountBalanceOutlinedIcon,
//         roles: [SUPER_ADMIN],
//       },
//       {
//         label: 'User Management',
//         path: PATHS.users,
//         icon: ManageAccountsOutlinedIcon,
//         roles: [SUPER_ADMIN],
//       },
//       {
//         label: 'Upload Image',
//         path: PATHS.uploadImages,
//         icon: ImageOutlinedIcon,
//         roles: [SUPER_ADMIN],
//       },
//     ],
//   },

//   // Bank-specific administration
//   {
//     label: 'Branch Management',
//     icon: AccountBalanceOutlinedIcon,
//     roles: [BANK_ADMIN],
//     children: [
//       {
//         label: 'Branches',
//         path: PATHS.branches,
//         icon: AccountBalanceOutlinedIcon,
//         roles: [BANK_ADMIN],
//       },
//       {
//         label: 'Branch Users',
//         path: PATHS.branchUsers,
//         icon: ShieldOutlinedIcon,
//         roles: [BANK_ADMIN],
//       },
//     ],
//   },

//   // Customer-facing modules
//   {
//     label: 'Customer Services',
//     icon: PeopleAltOutlinedIcon,
//     roles: [BANK_ADMIN, BANK_USER],
//     children: [
//       {
//         label: 'Customers',
//         path: PATHS.customers,
//         icon: PeopleAltOutlinedIcon,
//         roles: [BANK_ADMIN, BANK_USER],
//       },
//       {
//         label: 'Service Requests',
//         path: PATHS.serviceRequests,
//         icon: DescriptionOutlinedIcon,
//         roles: [BANK_ADMIN, BANK_USER],
//       },
//       {
//         label: 'Lead Enquiries',
//         path: PATHS.leadEnquiries,
//         icon: AttachMoneyOutlinedIcon,
//         roles: [BANK_ADMIN, BANK_USER],
//       },
//     ],
//   },

//   // Shared administrative tools
//   {
//     label: 'Administration',
//     icon: ManageAccountsOutlinedIcon,
//     roles: [SUPER_ADMIN, BANK_ADMIN],
//     children: [
//       {
//         label: 'Reports',
//         path: PATHS.reports,
//         icon: BarChartOutlinedIcon,
//         roles: [SUPER_ADMIN, BANK_ADMIN],
//       },
//       {
//         label: 'Push Notifications',
//         path: PATHS.pushNotifications,
//         icon: NotificationsNoneOutlinedIcon,
//         roles: [SUPER_ADMIN, BANK_ADMIN],
//       },
//       {
//         label: 'Device Reset',
//         path: PATHS.deviceReset,
//         icon: SmartphoneOutlinedIcon,
//         roles: [SUPER_ADMIN, BANK_ADMIN],
//       },
//       {
//         label: 'Banners & Content',
//         path: PATHS.banners,
//         icon: ImageOutlinedIcon,
//         roles: [BANK_ADMIN],
//       },
//     ],
//   },
// ];

// // Recursively filter menu and submenu items for the logged-in role.
// const filterItemsForRole = (
//   items: NavItem[],
//   role: Role,
// ): NavItem[] =>
//   items.flatMap((item) => {
//     if (!item.roles.includes(role)) {
//       return [];
//     }

//     if (item.children) {
//       const children = filterItemsForRole(item.children, role);

//       return children.length > 0
//         ? [{ ...item, children }]
//         : [];
//     }

//     return [item];
//   });

// export const getNavForRole = (role: Role): NavItem[] =>
//   filterItemsForRole(NAV_ITEMS, role);

// // Return all route-bearing items, including nested children.
// // Use this helper when AppRoutes generates protected routes from NAV_ITEMS.
// export const getAllNavRoutes = (
//   items: NavItem[] = NAV_ITEMS,
// ): NavItem[] =>
//   items.flatMap((item) => [
//     ...(item.path ? [item] : []),
//     ...(item.children ? getAllNavRoutes(item.children) : []),
//   ]);


  