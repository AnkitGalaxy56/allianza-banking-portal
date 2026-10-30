import type { Role } from '@/config/roles';

export interface UserProfile {
  id: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  userName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  accountState: string;
  designation: string;
  userRole: Role;
  loginBranch: string;
  branchId: string;
  allowMultiBranch: boolean;
  allowLoginOnHolidays: boolean;
  permittedLoginTime: string;
  permittedLogoutTime: string;
  lastLoginDate: string;
  lastLoginTime: string;
  sessionTimeoutSeconds: number;
  organizationName: string;
  organizationCode: string;
}

export type EditableProfileFields = Pick<UserProfile, 'email' | 'mobile'>;
