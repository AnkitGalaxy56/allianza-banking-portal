export type CustomerStatus = 'Active' | 'Pending' | 'Blocked';
export interface Customer {
  id: string;
  customerNumber: string;
  mobile: string;
  branchId: string;
  branchName: string;
  registered: string;
  device: 'Android' | 'iPhone';
  lastLogin: string;
  status: CustomerStatus;
  openRequests: number;
}
export interface CustomerQuery {
  page: number;
  pageSize: number;
  search?: string;
  branchId?: string;
  status?: CustomerStatus | 'all';
}
