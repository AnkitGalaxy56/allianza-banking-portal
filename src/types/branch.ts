export type BranchStatus = 'active' | 'inactive';

export interface Branch {
  id: string;
  name: string;
  code: string;
  ifsc: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  customers: number;
  status: BranchStatus;
}

export type BranchInput = Omit<Branch, 'id' | 'customers' | 'status'>;

export interface BranchQuery {
  page: number;
  pageSize: number;
  search?: string;
  status?: BranchStatus | 'all';
}
