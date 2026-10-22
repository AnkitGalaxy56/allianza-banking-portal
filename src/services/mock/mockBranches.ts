import type { Branch, BranchInput, BranchQuery } from '@/types/branch';
import type { Paginated } from '@/types/common';
import { delay } from '@/utils/delay';

const FIRST_EIGHT: Array<[string, string, number, Branch['status']]> = [
  ['Main branch', 'Pune', 6420, 'active'],
  ['Branch 2', 'Pune', 3118, 'active'],
  ['Branch 3', 'Pimpri', 2904, 'active'],
  ['Branch 4', 'Chinchwad', 2516, 'active'],
  ['Branch 5', 'Hadapsar', 1880, 'active'],
  ['Branch 6', 'Kothrud', 1742, 'inactive'],
  ['Branch 7', 'Wakad', 1205, 'active'],
  ['Branch 8', 'Baner', 988, 'active'],
];
const MORE_CITIES = ['Aundh', 'Viman Nagar', 'Kharadi', 'Katraj', 'Sinhagad Road', 'Hinjewadi'];

function seed(): Branch[] {
  const rows: Branch[] = [];
  for (let i = 0; i < 42; i += 1) {
    const [name, city, customers, status] =
      FIRST_EIGHT[i] ?? ([`Branch ${i + 1}`, MORE_CITIES[i % MORE_CITIES.length], Math.max(120, 900 - i * 15), i % 11 === 0 ? 'inactive' : 'active'] as [string, string, number, Branch['status']]);
    const n = String(i + 1).padStart(3, '0');
    rows.push({
      id: `br-${n}`,
      name,
      code: `BR${n}`,
      ifsc: `SUCB0000${n}`.slice(0, 11),
      address: `${i + 10}, Main Road, ${city}`,
      city,
      pincode: '411001',
      phone: `020 2550 ${String(1000 + i)}`,
      customers,
      status,
    });
  }
  return rows;
}

// In-memory "database" - resets when you refresh the page.
let branches: Branch[] = seed();

export async function mockListBranches(q: BranchQuery): Promise<Paginated<Branch>> {
  await delay(300);
  const term = q.search?.trim().toLowerCase();
  const filtered = branches.filter((b) => {
    const matchesText =
      !term ||
      b.name.toLowerCase().includes(term) ||
      b.code.toLowerCase().includes(term) ||
      b.city.toLowerCase().includes(term);
    const matchesStatus = !q.status || q.status === 'all' || b.status === q.status;
    return matchesText && matchesStatus;
  });
  const start = (q.page - 1) * q.pageSize;
  return {
    items: filtered.slice(start, start + q.pageSize),
    total: filtered.length,
    page: q.page,
    pageSize: q.pageSize,
  };
}

export async function mockCreateBranch(input: BranchInput): Promise<Branch> {
  await delay(400);
  if (branches.some((b) => b.code.toLowerCase() === input.code.toLowerCase())) {
    throw new Error('A branch with this code already exists.');
  }
  const created: Branch = { ...input, id: `br-${Date.now()}`, customers: 0, status: 'active' };
  branches = [created, ...branches];
  return created;
}

export async function mockUpdateBranch(id: string, input: BranchInput): Promise<Branch> {
  await delay(400);
  const existing = branches.find((b) => b.id === id);
  if (!existing) throw new Error('Branch not found.');
  if (branches.some((b) => b.id !== id && b.code.toLowerCase() === input.code.toLowerCase())) {
    throw new Error('A branch with this code already exists.');
  }
  const updated: Branch = { ...existing, ...input };
  branches = branches.map((b) => (b.id === id ? updated : b));
  return updated;
}
