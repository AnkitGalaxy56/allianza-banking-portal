import { z } from 'zod';

const employeeTitleSchema = z.enum(['Mr', 'Ms'], {
  required_error: 'Select a title',
});

const SYSTEM_ROLE_VALUES = ['Checker', 'Maker'] as const;
const TWO_FACTOR_DESIGNATION_VALUES = ['Primary', 'Secondary', 'Not Applicable'] as const;
const AUTHENTICATION_TYPE_VALUES = ['Password', 'OTP', 'Password + OTP', 'Authenticator App'] as const;

const getAllowedValue = <T extends string>(
  value: string | undefined,
  allowedValues: readonly T[],
  fallback: T,
): T => allowedValues.find((item) => item === value) ?? fallback;

const branchUserRoleSchema = z.enum(['Bank User', 'Admin User'], {
  required_error: 'Select a user role',
});

const systemRoleSchema = z.enum(SYSTEM_ROLE_VALUES, {
  required_error: 'Select a system role',
});

const statusSchema = z.enum(['Entered', 'Operative', 'In-Operative', 'Suspended', 'Password Blocked'], {
  required_error: 'Select a status',
});

const twoFactorDesignationSchema = z.enum(TWO_FACTOR_DESIGNATION_VALUES, {
  required_error: 'Select a 2FA login designation',
});

const authenticationTypeSchema = z.enum(AUTHENTICATION_TYPE_VALUES, {
  required_error: 'Select an authentication type',
});

export const branchUserSchema = z.object({
  title: employeeTitleSchema,
  employeeId: z.string().trim().min(1, 'Enter the employee ID').max(30, 'Employee ID is too long'),
  firstName: z.string().trim().min(1, 'Enter the first name').max(60, 'First name is too long'),
  middleName: z.string().trim().max(60, 'Middle name is too long'),
  lastName: z.string().trim().min(1, 'Enter the last name').max(60, 'Last name is too long'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a 10-digit mobile number'),
  email: z.string().trim().email('Enter a valid email address'),
  userName: z.string().trim().min(3, 'Enter a username with at least 3 characters').max(60, 'Username is too long'),
  displayName: z.string().trim().min(1, 'Enter a display name').max(100, 'Display name is too long'),
  role: branchUserRoleSchema,
  systemRole: systemRoleSchema,
  branchId: z.string().min(1, 'Select a branch'),
  multiBranchAccess: z.array(z.string()),
  status: statusSchema,
  dateOfBirth: z.string().min(1, 'Select date of birth').refine((value) => !Number.isNaN(Date.parse(value)) && Date.parse(value) < Date.now(), 'Date of birth must be a valid past date'),
  twoFactorDesignation: twoFactorDesignationSchema,
  idleTimeoutSeconds: z.string().regex(/^\d+$/, 'Enter timeout in seconds').refine((value) => Number(value) >= 30 && Number(value) <= 86400, 'Timeout must be between 30 and 86400 seconds'),
  badLoginCount: z.string().regex(/^\d+$/, 'Enter a valid login count').refine((value) => Number(value) >= 0 && Number(value) <= 999, 'Login count must be between 0 and 999'),
  loginTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Select a valid login time'),
  logoutTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Select a valid logout time'),
  inoperativeDate: z.string().refine((value) => value === '' || !Number.isNaN(Date.parse(value)), 'Select a valid in-operative date'),
  twoFactorLogin: z.enum(['Yes', 'No'], { required_error: 'Select 2FA login' }),
  authenticationType: authenticationTypeSchema,
  accessLevel: z.object({
    create: z.boolean(),
    modify: z.boolean(),
    view: z.boolean(),
    authorise: z.boolean(),
  }),
  sendLoginEmail: z.boolean(),
});

export type BranchUserFormValues = z.infer<typeof branchUserSchema>;

export const EMPTY_BRANCH_USER: BranchUserFormValues = {
  title: 'Mr',
  employeeId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  mobile: '',
  email: '',
  userName: '',
  displayName: '',
  role: 'Bank User',
  systemRole: 'Maker',
  branchId: '',
  multiBranchAccess: [],
  status: 'Entered',
  dateOfBirth: '',
  twoFactorDesignation: 'Primary',
  idleTimeoutSeconds: '300',
  badLoginCount: '0',
  loginTime: '09:00',
  logoutTime: '18:00',
  inoperativeDate: '',
  twoFactorLogin: 'No',
  authenticationType: 'Password',
  accessLevel: {
    create: false,
    modify: false,
    view: true,
    authorise: false,
  },
  sendLoginEmail: true,
};

export const userToFormValues = (user: import('@/types/branchUser').BranchUser): BranchUserFormValues => {
  const nameParts = (user.name ?? '').split(' ').filter(Boolean);
  return {
    title: user.title ?? 'Mr',
    employeeId: user.employeeId ?? user.id ?? '',
    firstName: user.firstName ?? nameParts[0] ?? '',
    middleName: user.middleName ?? '',
    lastName: user.lastName ?? nameParts.slice(1).join(' '),
    mobile: user.mobile ?? '',
    email: user.email ?? '',
    userName: user.userName ?? (user.email ? user.email.split('@')[0] : ''),
    displayName: user.displayName ?? user.name ?? '',
    role: user.role === 'Admin User' ? 'Admin User' : 'Bank User',
    systemRole: getAllowedValue(user.systemRole, SYSTEM_ROLE_VALUES, 'Maker'),
    branchId: user.branchId ?? '',
    multiBranchAccess: user.multiBranchAccess ?? (user.branchId ? [user.branchId] : []),
    status: user.status ?? 'Entered',
    dateOfBirth: user.dateOfBirth ?? '',
    twoFactorDesignation: getAllowedValue(user.twoFactorDesignation, TWO_FACTOR_DESIGNATION_VALUES, 'Primary'),
    idleTimeoutSeconds: String(user.idleTimeoutSeconds ?? 300),
    badLoginCount: String(user.badLoginCount ?? 0),
    loginTime: user.loginTime ?? '',
    logoutTime: user.logoutTime ?? '',
    inoperativeDate: user.inoperativeDate ?? '',
    twoFactorLogin: user.twoFactorLogin ? 'Yes' : 'No',
    authenticationType: getAllowedValue(user.authenticationType, AUTHENTICATION_TYPE_VALUES, 'Password'),
    accessLevel: {
      create: user.accessLevel?.create ?? false,
      modify: user.accessLevel?.modify ?? false,
      view: user.accessLevel?.view ?? true,
      authorise: user.accessLevel?.authorise ?? false,
    },
    sendLoginEmail: false,
  };
};
