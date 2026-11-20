import type { RequestStatus } from './common';

export type StatIcon =
  | 'branches'
  | 'customers'
  | 'requests'
  | 'notifications'
  | 'banks'
  | 'users'
  | 'accounts'
  | 'loans';

export interface StatCardData {
  key: string;
  label: string;
  value: string;
  helper?: string;
  helperTone?: 'success' | 'warning' | 'neutral';
  icon: StatIcon;
}

export interface ServiceRequestRow {
  id: string;
  customer: string;
  type: string;
  branch: string;
  submitted: string;
  status: RequestStatus;
}

export interface BarItem {
  label: string;
  count: number;
}

export interface BankDashboardData {
  stats: StatCardData[];
  branches: string[];
  recentRequests: ServiceRequestRow[];
  leadEnquiries: BarItem[];
}

export interface BankSummaryRow {
  id: string;
  name: string;
  code: string;
  type: string;
  branches: number;
  users: number;
  status: 'active' | 'inactive';
}

export interface SuperAdminDashboardData {
  stats: StatCardData[];
  recentBanks: BankSummaryRow[];
  requestsByBank: BarItem[];
}

/** Analytics summary used by the Super Admin dashboard's bank-level card. */
export interface BankRequestAnalytics {
  code: string;
  bank: string;
  branches: number;
  pending: number;
  total: number;
}

/** Branch analytics summary used by the dashboard's branch-level card. */
export interface BranchRequestAnalytics {
  branch: string;
  pending: number;
  total: number;
  types: Array<{ label: string; count: number }>;
}
