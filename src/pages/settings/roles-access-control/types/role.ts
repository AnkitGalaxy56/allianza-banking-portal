export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve';
export interface ModulePermission {
  module: string;
  actions: PermissionAction[];
}
export interface AccessRole {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  assignedUsers: number;
  permissions: ModulePermission[];
  systemRole?: boolean;
}
