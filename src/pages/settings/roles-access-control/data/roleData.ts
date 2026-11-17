import type { AccessRole, PermissionAction } from '../types/role';

// Permission modules intentionally match the visible web-screen labels in navigation.ts.
export const PERMISSION_MODULES: { module: string; actions: PermissionAction[] }[] = [
  { module: 'Dashboard', actions: ['view'] },
  { module: 'Request Handling', actions: ['view'] },
  { module: 'Masters', actions: ['view'] },
  { module: 'Mobile Utilities', actions: ['view'] },
  { module: 'User Management', actions: ['view'] },
  { module: 'Reports', actions: ['view'] },
  { module: 'Settings', actions: ['view'] },
  { module: 'Bank Master', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'Branch Master', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'User Master', actions: ['view', 'create', 'edit'] },
  { module: 'Assign Password', actions: ['view', 'edit'] },
  { module: 'Payments', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'Cheque Book', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'Stop Payment', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'FD Opening', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'RD Opening', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'FD / RD Closing', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'Locker Application', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'Standing Instructions', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'Fresh Loan Application', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'Loan EMI Payment', actions: ['view', 'create', 'edit', 'approve'] },
  { module: 'Image Uploading', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'Push Notification', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'Device Reset', actions: ['view', 'create', 'edit'] },
  { module: 'Requests', actions: ['view'] },
  { module: 'User Master Report', actions: ['view'] },
  { module: 'Notification', actions: ['view'] },
  { module: 'Change Password', actions: ['view', 'edit'] },
  { module: 'Profile', actions: ['view', 'edit'] },
  { module: 'Roles and Access Control', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'Change Colour Theme', actions: ['view', 'edit'] },
  { module: 'Banners & Content', actions: ['view', 'create', 'edit', 'delete'] },
];

const all = (actions: PermissionAction[]) => PERMISSION_MODULES.map(m => ({ module: m.module, actions: [...actions].filter(a => m.actions.includes(a)) })).filter(m => m.actions.length);
const only = (names: string[]) => PERMISSION_MODULES.filter(m => names.includes(m.module)).map(m => ({ module: m.module, actions: m.actions.filter(a => a === 'view') }));

export const initialRoles: AccessRole[] = [
  { id: 'role-super-admin', name: 'Super Admin', description: 'Full access to administration and banking operations.', status: 'Active', assignedUsers: 0, permissions: all(['view', 'create', 'edit', 'delete', 'approve']), systemRole: true },
  { id: 'role-branch-user', name: 'Branch User', description: 'Branch-level access to customer and application workflows.', status: 'Active', assignedUsers: 0, permissions: only(['Dashboard', 'Payments', 'Cheque Book', 'Stop Payment', 'FD Opening', 'RD Opening', 'FD / RD Closing', 'Locker Application', 'Standing Instructions', 'Fresh Loan Application', 'Loan EMI Payment', 'Requests']), systemRole: true },
  { id: 'role-credit-user', name: 'Credit User', description: 'Reviews applications and records credit decisions.', status: 'Active', assignedUsers: 0, permissions: PERMISSION_MODULES.filter(m => ['Dashboard', 'Fresh Loan Application', 'Loan EMI Payment', 'Requests'].includes(m.module)).map(m => ({ module: m.module, actions: m.actions.filter(a => ['view', 'approve', 'edit'].includes(a)) })), systemRole: true },
  { id: 'role-audit-user', name: 'Audit User', description: 'Read-only access to operational records and reports.', status: 'Active', assignedUsers: 0, permissions: PERMISSION_MODULES.filter(m => m.actions.includes('view')).map(m => ({ module: m.module, actions: ['view'] as PermissionAction[] })), systemRole: true },
];
