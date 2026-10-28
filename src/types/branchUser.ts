export type BranchUserStatus = 'Active' | 'Inactive' | 'Invited' | 'Locked';
export type BranchUserRole = 'Manager' | 'Officer';
export type BranchUserTitle = 'Mr' | 'Ms';

export interface MenuFunctionAccessLevel {
  create: boolean;
  modify: boolean;
  view: boolean;
  authorise: boolean;
}

/** User Master record used by the bank's user-management screen. */
export interface BranchUser {
  id: string;
  title: BranchUserTitle;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  mobile: string;
  email: string;
  userName: string;
  displayName: string;
  role: BranchUserRole;
  systemRole: string;
  branchId: string;
  branchName: string;
  multiBranchAccess: string[];
  status: BranchUserStatus;
  dateOfBirth: string;
  twoFactorDesignation: string;
  idleTimeoutSeconds: number;
  badLoginCount: number;
  loginTime: string;
  logoutTime: string;
  inoperativeDate: string;
  twoFactorLogin: boolean;
  authenticationType: string;
  accessLevel: MenuFunctionAccessLevel;
  lastLogin: string;
}

/** Payload for creating/updating a User Master entry. */
export interface BranchUserInput {
  title: BranchUserTitle;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  mobile: string;
  email: string;
  userName: string;
  displayName: string;
  role: BranchUserRole;
  systemRole: string;
  branchId: string;
  multiBranchAccess: string[];
  status: BranchUserStatus;
  dateOfBirth: string;
  twoFactorDesignation: string;
  idleTimeoutSeconds: number;
  badLoginCount: number;
  loginTime: string;
  logoutTime: string;
  inoperativeDate: string;
  twoFactorLogin: boolean;
  authenticationType: string;
  accessLevel: MenuFunctionAccessLevel;
  sendLoginEmail: boolean;
}

export interface BranchUserQuery {
  page: number;
  pageSize: number;
  search?: string;
  branchId?: string;
  role?: BranchUserRole | 'all';
}
