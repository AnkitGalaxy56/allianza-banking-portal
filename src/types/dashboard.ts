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
