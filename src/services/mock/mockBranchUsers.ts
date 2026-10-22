import type { BranchUser, BranchUserInput, BranchUserQuery } from '@/types/branchUser';
import type { Paginated } from '@/types/common';
import { delay } from '@/utils/delay';

const BRANCHES = [
  { id: 'br-001', name: 'Main branch' }, { id: 'br-002', name: 'Branch 2' },
  { id: 'br-003', name: 'Branch 3' }, { id: 'br-004', name: 'Branch 4' },
  { id: 'br-005', name: 'Branch 5' }, { id: 'br-006', name: 'Branch 6' },
  { id: 'br-007', name: 'Branch 7' }, { id: 'br-008', name: 'Branch 8' },
];
const STATUSES: BranchUser['status'][] = ['Active', 'Active', 'Active', 'Invited', 'Locked'];
const USERS: BranchUser[] = Array.from({ length: 96 }, (_, i) => {
  const branch = BRANCHES[i % BRANCHES.length];
  return {
    id: `bu-${String(i + 1).padStart(3, '0')}`,
    name: i === 0 ? 'Amit Sharma' : i === 1 ? 'Priya Patil' : `User name ${i + 1}`,
    email: `user${i + 1}@bank.example`,
    mobile: `98${String(10000000 + i * 137).slice(0, 8)}`,
    branchId: branch.id,
    branchName: branch.name,
    role: i % 3 === 0 ? 'Manager' : 'Officer',
    lastLogin: ['Today, 10:42', 'Today, 09:15', 'Yesterday', 'Never', '3 days ago'][i % 5],
    status: STATUSES[i % STATUSES.length],
  };
});
let users = [...USERS];

export async function mockListBranchUsers(q: BranchUserQuery): Promise<Paginated<BranchUser>> {
  await delay(250);
  const term = q.search?.trim().toLowerCase();
  const filtered = users.filter((u) =>
    (!term || [u.name, u.email, u.mobile].some((v) => v.toLowerCase().includes(term))) &&
    (!q.branchId || q.branchId === 'all' || u.branchId === q.branchId) &&
    (!q.role || q.role === 'all' || u.role === q.role),
  );
  const start = (q.page - 1) * q.pageSize;
  return { items: filtered.slice(start, start + q.pageSize), total: filtered.length, page: q.page, pageSize: q.pageSize };
}
export async function mockCreateBranchUser(input: BranchUserInput): Promise<BranchUser> {
  await delay(300);
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) throw new Error('A user with this email already exists.');
  const branch = BRANCHES.find((b) => b.id === input.branchId);
  if (!branch) throw new Error('Please select a valid branch.');
  const user: BranchUser = {
    id: `bu-${Date.now()}`, name: input.name.trim(), email: input.email.trim(), mobile: input.mobile,
    branchId: branch.id, branchName: branch.name, role: input.role, lastLogin: 'Never', status: 'Invited',
  };
  users = [user, ...users];
  return user;
}
export async function mockUpdateBranchUser(id: string, input: BranchUserInput): Promise<BranchUser> {
  await delay(300);
  const existing = users.find((u) => u.id === id);
  if (!existing) throw new Error('Branch user not found.');
  if (users.some((u) => u.id !== id && u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('A user with this email already exists.');
  }
  const branch = BRANCHES.find((b) => b.id === input.branchId);
  if (!branch) throw new Error('Please select a valid branch.');
  const updated: BranchUser = {
    ...existing,
    name: input.name.trim(),
    email: input.email.trim(),
    mobile: input.mobile,
    branchId: branch.id,
    branchName: branch.name,
    role: input.role,
  };
  users = users.map((u) => u.id === id ? updated : u);
  return updated;
}

export async function mockUpdateBranchUserStatus(id: string, status: BranchUser['status']): Promise<void> {
  await delay(250);
  users = users.map((u) => u.id === id ? { ...u, status } : u);
}
