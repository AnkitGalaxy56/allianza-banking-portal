export type BranchUserStatus = 'Active' | 'Invited' | 'Locked';
export type BranchUserRole = 'Manager' | 'Officer';
export interface BranchUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  branchId: string;
  branchName: string;
  role: BranchUserRole;
  lastLogin: string;
  status: BranchUserStatus;
}
export interface BranchUserInput {
  name: string;
  email: string;
  mobile: string;
  branchId: string;
  role: BranchUserRole;
  sendLoginEmail: boolean;
}
export interface BranchUserQuery {
  page: number;
  pageSize: number;
  search?: string;
  branchId?: string;
  role?: BranchUserRole | 'all';
}
