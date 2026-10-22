import type { Customer, CustomerQuery, CustomerStatus } from '@/types/customer';
import type { Paginated } from '@/types/common';
import { delay } from '@/utils/delay';

const BRANCHES = [
  { id: 'br-001', name: 'Main branch' }, { id: 'br-002', name: 'Branch 2' },
  { id: 'br-003', name: 'Branch 3' }, { id: 'br-004', name: 'Branch 4' },
  { id: 'br-005', name: 'Branch 5' }, { id: 'br-006', name: 'Branch 6' },
  { id: 'br-007', name: 'Branch 7' }, { id: 'br-008', name: 'Branch 8' },
];
const statuses: CustomerStatus[] = ['Active', 'Active', 'Active', 'Pending', 'Blocked'];
function makeCustomer(i: number): Customer {
  const branch = BRANCHES[i % BRANCHES.length];
  return {
    id: `cu-${i + 1}`, customerNumber: `XXXXXX${String(4821 + i * 137).slice(-4)}`,
    mobile: `${['98', '97', '99', '90', '96'][i % 5]}XXXXXXX${String((i * 7 + 1) % 10)}`,
    branchId: branch.id, branchName: branch.name,
    registered: ['02 Jan 2026', '14 Feb 2026', '21 Mar 2026', '12 Oct 2026', '30 Apr 2026', '08 Jun 2026'][i % 6],
    device: i % 4 === 1 ? 'iPhone' : 'Android',
    lastLogin: ['Today, 10:42', 'Today, 09:15', 'Yesterday', 'Never', '5 days ago', '2 days ago'][i % 6],
    status: statuses[i % statuses.length], openRequests: i % 4,
  };
}
export async function mockListCustomers(q: CustomerQuery): Promise<Paginated<Customer>> {
  await delay(250);
  // Large deterministic mock dataset; rows are generated only for the requested page.
  const totalRows = 38210;
  const term = q.search?.trim().toLowerCase();
  const matches = (i: number) => {
    const c = makeCustomer(i);
    return (!term || c.customerNumber.toLowerCase().includes(term) || c.mobile.toLowerCase().includes(term)) &&
      (!q.branchId || q.branchId === 'all' || c.branchId === q.branchId) &&
      (!q.status || q.status === 'all' || c.status === q.status);
  };
  // For mock pagination, search scans a bounded sample; default listing represents the full dataset.
  let indexes: number[] = [];
  if (!term && (!q.branchId || q.branchId === 'all') && (!q.status || q.status === 'all')) {
    const start = (q.page - 1) * q.pageSize;
    indexes = Array.from({ length: q.pageSize }, (_, i) => start + i).filter((i) => i < totalRows);
  } else {
    for (let i = 0; i < 2500 && indexes.length < q.page * q.pageSize; i += 1) if (matches(i)) indexes.push(i);
    indexes = indexes.slice((q.page - 1) * q.pageSize, q.page * q.pageSize);
  }
  const items = indexes.map(makeCustomer);
  const total = (!term && (!q.branchId || q.branchId === 'all') && (!q.status || q.status === 'all'))
    ? totalRows : Math.max(items.length, indexes.length * q.pageSize);
  return { items, total, page: q.page, pageSize: q.pageSize };
}
export async function mockUpdateCustomerStatus(id: string, status: CustomerStatus): Promise<void> {
  await delay(250);
  const numericId = Number(id.replace('cu-', ''));
  if (!Number.isFinite(numericId) || numericId < 1) throw new Error('Customer not found.');
  // Demo-only action: generated mock rows are not persisted across refreshes.
  void status;
}
