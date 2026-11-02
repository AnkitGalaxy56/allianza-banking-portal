export interface UserMasterReportRow {
  id: string;
  employeeNo: string;
  employeeName: string;
  designation: string;
  role: string;
  branch: string;
  mobile: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Locked';
  lastLogin: string;
  lastLoginDate: string;
}

export interface UserMasterReportFilterState {
  search: string;
  branch: string;
  status: string;
  fromDate: string;
  toDate: string;
}
