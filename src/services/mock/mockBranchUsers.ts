import type { BranchUser, BranchUserInput, BranchUserQuery } from '@/types/branchUser';
import type { Paginated } from '@/types/common';
import { delay } from '@/utils/delay';

export const MOCK_BRANCHES = [
  { id: 'br-001', name: 'Main branch' },
  { id: 'br-002', name: 'Branch 2' },
  { id: 'br-003', name: 'Branch 3' },
  { id: 'br-004', name: 'Branch 4' },
  { id: 'br-005', name: 'Branch 5' },
  { id: 'br-006', name: 'Branch 6' },
  { id: 'br-007', name: 'Branch 7' },
  { id: 'br-008', name: 'Branch 8' },
];

const STATUSES: BranchUser['status'][] = ['Active', 'Active', 'Active', 'Invited', 'Locked'];
const LOGIN_TIMES = ['09:00', '09:15', '09:30', '10:00', '10:42'];
const LOGOUT_TIMES = ['17:30', '18:00', '18:15', '18:30', ''];

const buildName = (firstName: string, middleName: string, lastName: string) =>
  [firstName, middleName, lastName].map((part) => part.trim()).filter(Boolean).join(' ');

const USERS: BranchUser[] = Array.from({ length: 96 }, (_, i) => {
  const branch = MOCK_BRANCHES[i % MOCK_BRANCHES.length];
  const sampleNames = [
    { title: 'Mr' as const, firstName: 'Amit', middleName: '', lastName: 'Sharma' },
    { title: 'Ms' as const, firstName: 'Priya', middleName: '', lastName: 'Patil' },
    { title: 'Mr' as const, firstName: 'Rahul', middleName: 'S', lastName: 'Deshmukh' },
    { title: 'Ms' as const, firstName: 'Sneha', middleName: '', lastName: 'Kulkarni' },
  ];
  const person = sampleNames[i % sampleNames.length];
  const name = i < sampleNames.length ? buildName(person.firstName, person.middleName, person.lastName) : `User name ${i + 1}`;
  const fallback = i < sampleNames.length
    ? person
    : { title: (i % 2 === 0 ? 'Mr' : 'Ms') as const, firstName: 'User', middleName: '', lastName: `name ${i + 1}` };
  const role: BranchUser['role'] = i % 3 === 0 ? 'Manager' : 'Officer';
  const status = STATUSES[i % STATUSES.length];

  return {
    id: `bu-${String(i + 1).padStart(3, '0')}`,
    title: fallback.title,
    employeeId: `EMP${String(1001 + i)}`,
    firstName: fallback.firstName,
    middleName: fallback.middleName,
    lastName: fallback.lastName,
    name,
    mobile: `98${String(10000000 + i * 137).slice(0, 8)}`,
    email: `user${i + 1}@bank.example`,
    userName: i === 0 ? 'amit.sharma' : i === 1 ? 'priya.patil' : `user${i + 1}`,
    displayName: name,
    role,
    systemRole: role === 'Manager' ? 'Branch Manager' : 'Branch Officer',
    branchId: branch.id,
    branchName: branch.name,
    multiBranchAccess: i % 4 === 0 ? [branch.id, MOCK_BRANCHES[(i + 1) % MOCK_BRANCHES.length].id] : [branch.id],
    status,
    dateOfBirth: i % 4 === 0 ? '1992-05-14' : '',
    twoFactorDesignation: i % 2 === 0 ? 'Primary' : 'Secondary',
    idleTimeoutSeconds: 300,
    badLoginCount: status === 'Locked' ? 5 : 0,
    loginTime: LOGIN_TIMES[i % LOGIN_TIMES.length],
    logoutTime: LOGOUT_TIMES[i % LOGOUT_TIMES.length],
    inoperativeDate: '',
    twoFactorLogin: i % 2 === 0,
    authenticationType: i % 2 === 0 ? 'Password + OTP' : 'Password',
    accessLevel: {
      create: role === 'Manager',
      modify: role === 'Manager',
      view: true,
      authorise: role === 'Manager',
    },
    lastLogin: ['Today, 10:42', 'Today, 09:15', 'Yesterday', 'Never', '3 days ago'][i % 5],
  };
});

let users = [...USERS];

export async function mockListBranchUsers(q: BranchUserQuery): Promise<Paginated<BranchUser>> {
  await delay(250);
  const term = q.search?.trim().toLowerCase();
  const filtered = users.filter((u) =>
    (!term || [u.title, u.employeeId, u.name, u.userName, u.displayName, u.email, u.mobile, u.branchName]
      .some((v) => v.toLowerCase().includes(term))) &&
    (!q.branchId || q.branchId === 'all' || u.branchId === q.branchId) &&
    (!q.role || q.role === 'all' || u.role === q.role),
  );
  const start = (q.page - 1) * q.pageSize;
  return {
    items: filtered.slice(start, start + q.pageSize),
    total: filtered.length,
    page: q.page,
    pageSize: q.pageSize,
  };
}

const inputToUser = (input: BranchUserInput, id: string, existing?: BranchUser): BranchUser => {
  const branch = MOCK_BRANCHES.find((b) => b.id === input.branchId);
  if (!branch) throw new Error('Please select a valid branch.');

  return {
    ...existing,
    id,
    title: input.title,
    employeeId: input.employeeId.trim(),
    firstName: input.firstName.trim(),
    middleName: input.middleName.trim(),
    lastName: input.lastName.trim(),
    name: buildName(input.firstName, input.middleName, input.lastName),
    mobile: input.mobile,
    email: input.email.trim(),
    userName: input.userName.trim(),
    displayName: input.displayName.trim(),
    role: input.role,
    systemRole: input.systemRole,
    branchId: branch.id,
    branchName: branch.name,
    multiBranchAccess: input.multiBranchAccess,
    status: input.status,
    dateOfBirth: input.dateOfBirth,
    twoFactorDesignation: input.twoFactorDesignation,
    idleTimeoutSeconds: input.idleTimeoutSeconds,
    badLoginCount: input.badLoginCount,
    loginTime: input.loginTime,
    logoutTime: input.logoutTime,
    inoperativeDate: input.inoperativeDate,
    twoFactorLogin: input.twoFactorLogin,
    authenticationType: input.authenticationType,
    accessLevel: input.accessLevel,
    lastLogin: existing?.lastLogin ?? 'Never',
  };
};

export async function mockCreateBranchUser(input: BranchUserInput): Promise<BranchUser> {
  await delay(300);
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('A user with this email already exists.');
  }
  if (users.some((u) => u.employeeId.toLowerCase() === input.employeeId.toLowerCase())) {
    throw new Error('An employee with this ID already exists.');
  }
  if (users.some((u) => u.userName.toLowerCase() === input.userName.toLowerCase())) {
    throw new Error('This username is already in use.');
  }

  const user = inputToUser(input, `bu-${Date.now()}`);
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
  if (users.some((u) => u.id !== id && u.employeeId.toLowerCase() === input.employeeId.toLowerCase())) {
    throw new Error('An employee with this ID already exists.');
  }
  if (users.some((u) => u.id !== id && u.userName.toLowerCase() === input.userName.toLowerCase())) {
    throw new Error('This username is already in use.');
  }

  const updated = inputToUser(input, id, existing);
  users = users.map((u) => u.id === id ? updated : u);
  return updated;
}

export async function mockUpdateBranchUserStatus(id: string, status: BranchUser['status']): Promise<void> {
  await delay(250);
  users = users.map((u) => u.id === id ? { ...u, status } : u);
}
