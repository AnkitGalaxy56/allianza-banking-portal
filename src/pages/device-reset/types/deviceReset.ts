export interface DeviceResetRecord {
  customer: string;
  branch: string;
  reason: string;
  by: string;
  date: string;
  status: 'completed' | 'in_review';
}
