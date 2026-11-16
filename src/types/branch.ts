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
  /** Bank the branch belongs to (MB002002.bank_code). */
  bankCode?: string;
  bankName?: string;
}

export type BranchInput = Omit<Branch, 'id' | 'customers' | 'status' | 'bankName'>;

export interface BranchQuery {
  page: number;
  pageSize: number;
  search?: string;
  status?: BranchStatus | 'all';
}
