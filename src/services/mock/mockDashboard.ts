import type {
  BankDashboardData,
  ServiceRequestRow,
  SuperAdminDashboardData,
} from '@/types/dashboard';
import { delay } from '@/utils/delay';

const REQUESTS: ServiceRequestRow[] = [
  { id: 'REQ-10482', customer: 'XXXXXX4821', type: 'Cheque book', branch: 'Main branch', submitted: '13 Oct', status: 'new' },
  { id: 'REQ-10479', customer: 'XXXXXX1176', type: 'KYC documents', branch: 'Branch 4', submitted: '13 Oct', status: 'in_review' },
  { id: 'REQ-10471', customer: 'XXXXXX9035', type: 'Debit card', branch: 'Branch 2', submitted: '12 Oct', status: 'in_review' },
  { id: 'REQ-10463', customer: 'XXXXXX2290', type: 'Loan enquiry', branch: 'Main branch', submitted: '12 Oct', status: 'new' },
  { id: 'REQ-10455', customer: 'XXXXXX6613', type: 'Change mail ID', branch: 'Branch 7', submitted: '11 Oct', status: 'completed' },
  { id: 'REQ-10448', customer: 'XXXXXX3307', type: 'Nomination', branch: 'Branch 2', submitted: '11 Oct', status: 'completed' },
];

export async function mockBankDashboard(branch?: string): Promise<BankDashboardData> {
  await delay(350);
  const recentRequests = branch ? REQUESTS.filter((r) => r.branch === branch) : REQUESTS;
  return {
    branches: ['Main branch', 'Branch 2', 'Branch 4', 'Branch 7'],
    stats: [
      { key: 'branches', label: 'Branches', value: '42', helper: 'All branches active', helperTone: 'success', icon: 'branches' },
      { key: 'customers', label: 'Registered customers', value: '38,210', helper: '+312 this week', helperTone: 'success', icon: 'customers' },
      { key: 'pending', label: 'Pending requests', value: '57', helper: '14 older than 3 days', helperTone: 'warning', icon: 'requests' },
      { key: 'notifications', label: 'Notifications sent', value: '12', helper: 'This week', helperTone: 'neutral', icon: 'notifications' },
    ],
    recentRequests,
    leadEnquiries: [
      { label: 'Personal loan', count: 28 },
      { label: 'Vehicle loan', count: 17 },
      { label: 'Home loan', count: 9 },
    ],
  };
}

export async function mockSuperAdminDashboard(): Promise<SuperAdminDashboardData> {
  await delay(350);
  return {
    stats: [
      { key: 'banks', label: 'No. of banks', value: '3', helper: 'All banks active', helperTone: 'success', icon: 'banks' },
      { key: 'users', label: 'No. of application users', value: '1,24,860', helper: '+2,140 this week', helperTone: 'success', icon: 'users' },
      { key: 'requests', label: 'No. of requests', value: '412', helper: '38 pending', helperTone: 'warning', icon: 'requests' },
    ],
    recentBanks: [
      { id: 'b-1', name: 'Sample Urban Co-op Bank', code: 'sample-urban', type: 'Urban Co-operative', branches: 42, users: 38210, status: 'active' },
      { id: 'b-2', name: 'Demo Sahakari Bank', code: 'demo-sahakari', type: 'Sahakari', branches: 27, users: 51480, status: 'active' },
      { id: 'b-3', name: 'Nagar Co-op Bank', code: 'nagar-co-op', type: 'Urban Co-operative', branches: 18, users: 35170, status: 'active' },
    ],
    requestsByBank: [
      { label: 'Sample Urban Co-op Bank', count: 57 },
      { label: 'Demo Sahakari Bank', count: 44 },
      { label: 'Nagar Co-op Bank', count: 31 },
    ],
  };
}
