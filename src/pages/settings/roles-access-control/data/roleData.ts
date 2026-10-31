import type { AccessRole, PermissionAction } from '../types/role';

export const PERMISSION_MODULES: { module: string; actions: PermissionAction[] }[] = [
  { module: 'Dashboard', actions: ['view'] },
  { module: 'Bank Management', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'Branch Management', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'User Management', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'Customer Management', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  { module: 'Lead Management', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  { module: 'Loan Applications', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  { module: 'Request Validation', actions: ['view', 'approve'] },
  { module: 'Reports', actions: ['view'] },
  { module: 'Notifications', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'Settings', actions: ['view', 'edit'] },
  { module: 'Role & Access Management', actions: ['view', 'create', 'edit', 'delete'] },
];

const all = (actions: PermissionAction[]) => PERMISSION_MODULES.map(m => ({ module: m.module, actions: [...actions].filter(a => m.actions.includes(a)) })).filter(m => m.actions.length);
const only = (names: string[]) => PERMISSION_MODULES.filter(m => names.includes(m.module)).map(m => ({ module: m.module, actions: m.actions.filter(a => a === 'view') }));

export const initialRoles: AccessRole[] = [
  { id: 'role-super-admin', name: 'Super Admin', description: 'Full access to administration and banking operations.', status: 'Active', assignedUsers: 10, permissions: all(['view', 'create', 'edit', 'delete', 'approve']), systemRole: true },
  { id: 'role-branch-user', name: 'Branch User', description: 'Branch-level access to customer and application workflows.', status: 'Active', assignedUsers: 0, permissions: only(['Dashboard', 'Customer Management', 'Request Validation', 'Reports']) , systemRole: true},
  { id: 'role-credit-user', name: 'Credit User', description: 'Reviews applications and records credit decisions.', status: 'Active', assignedUsers: 0, permissions: PERMISSION_MODULES.filter(m => ['Dashboard', 'Customer Management', 'Lead Management', 'Loan Applications', 'Reports'].includes(m.module)).map(m => ({ module: m.module, actions: m.actions.filter(a => ['view', 'approve', 'edit'].includes(a)) })), systemRole: true },
  { id: 'role-audit-user', name: 'Audit User', description: 'Read-only access to operational records and reports.', status: 'Active', assignedUsers: 0, permissions: PERMISSION_MODULES.map(m => ({ module: m.module, actions: m.actions.includes('view') ? ['view'] : [] })).filter(m => m.actions.length), systemRole: true },
];
